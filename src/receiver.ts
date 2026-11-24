import type {
  HyperReceiver,
  ServerRequestContext,
  TransportRequest,
  TransportResponse,
} from "@hyperttp/types";
import { decodeGrpcFrame, encodeGrpcFrame } from "./framing.js";
import type { GrpcServerRequest, GrpcServerResponse } from "./types.js";

const DEFAULT_MAX_MESSAGE_BYTES = 16 * 1024 * 1024;

function encodeGrpcMessage(message: string): string {
  return encodeURIComponent(message).replace(/%2F/gi, "/");
}

export interface GrpcReceiverOptions {
  /** Application handler. When omitted, the core listen handler is used. */
  handler?: (
    request: GrpcServerRequest,
    ctx: ServerRequestContext,
  ) => GrpcServerResponse | Promise<GrpcServerResponse>;
  /** Maximum unary request message size in bytes. Default: 16 MiB. */
  maxMessageBytes?: number;
}

function isAsyncIterable(value: unknown): value is AsyncIterable<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    Symbol.asyncIterator in value &&
    typeof value[Symbol.asyncIterator] === "function"
  );
}

function toBytes(value: unknown): Uint8Array {
  if (value instanceof Uint8Array) return value;
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }
  if (typeof value === "string") return new TextEncoder().encode(value);
  throw new TypeError("gRPC request body must be bytes or an async iterable of bytes.");
}

async function readRequestBody(body: unknown, maxMessageBytes: number): Promise<Uint8Array> {
  if (body == null) return new Uint8Array();

  if (!isAsyncIterable(body)) return toBytes(body);

  const chunks: Uint8Array[] = [];
  let total = 0;
  for await (const chunk of body) {
    const bytes = toBytes(chunk);
    total += bytes.byteLength;
    if (total > maxMessageBytes) {
      throw new RangeError(`gRPC request exceeded maxMessageBytes (${maxMessageBytes} bytes).`);
    }
    chunks.push(bytes);
  }

  const message = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    message.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return message;
}

/**
 * @ru Минимальный unary gRPC-ресивер. Разбирает HTTP/2 запрос в service/method
 * и raw Protobuf payload, а ответ упаковывает в gRPC-фрейм и trailers.
 * @en Minimal unary gRPC receiver. Parses an HTTP/2 request into service/method
 * and a raw Protobuf payload, and frames the response with gRPC trailers.
 */
export class GrpcReceiver implements HyperReceiver<
  GrpcServerRequest,
  GrpcServerResponse,
  TransportRequest,
  TransportResponse,
  "grpc"
> {
  readonly protocol = "grpc";
  private readonly handler?: GrpcReceiverOptions["handler"];
  private readonly maxMessageBytes: number;

  constructor(options: GrpcReceiverOptions = {}) {
    this.handler = options.handler;
    this.maxMessageBytes = options.maxMessageBytes ?? DEFAULT_MAX_MESSAGE_BYTES;
  }

  async receive(raw: TransportRequest, _ctx: ServerRequestContext): Promise<GrpcServerRequest> {
    const url = new URL(raw.url, "http://hyperttp.local");
    const segments = url.pathname.split("/").filter(Boolean);
    const method = segments.pop();
    const service = segments.join(".");
    if (!service || !method) {
      throw new Error(`[GrpcReceiver] Invalid gRPC path "${url.pathname}".`);
    }

    const frame = await readRequestBody(raw.body, this.maxMessageBytes);
    const { compressed, payload } = decodeGrpcFrame(frame);

    return {
      service,
      method,
      headers: raw.headers,
      message: payload,
      compressed,
    };
  }

  handle(
    request: GrpcServerRequest,
    ctx: ServerRequestContext,
  ): GrpcServerResponse | Promise<GrpcServerResponse> {
    if (!this.handler) {
      throw new Error('[GrpcReceiver] No application handler registered for protocol "grpc".');
    }
    return this.handler(request, ctx);
  }

  respond(response: GrpcServerResponse, _ctx: ServerRequestContext): TransportResponse {
    const grpcStatus = response.grpcStatus ?? 0;
    const headers: Record<string, string> = {
      "content-type": "application/grpc",
      ...response.headers,
    };
    const trailers: Record<string, string> = {
      "grpc-status": String(grpcStatus),
      ...(response.grpcMessage ? { "grpc-message": encodeGrpcMessage(response.grpcMessage) } : {}),
      ...response.trailers,
    };

    return {
      status: 200,
      headers,
      trailers,
      body: grpcStatus === 0 && response.body ? encodeGrpcFrame(response.body) : undefined,
    };
  }
}
