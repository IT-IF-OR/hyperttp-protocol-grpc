import type { UniversalResponse } from "@hyperttp/types";

/**
 * @ru Входные данные gRPC-вызова.
 * @en Input of a gRPC call.
 */
export interface GrpcInput<TReq = unknown, TRes = unknown> {
  /** @example "api.v1.UserService" */
  service: string;
  /** @example "GetUser" */
  method: string;
  message: TReq;
  /** Функция сериализации в Protobuf (например, из ts-proto или protobufjs) */
  encode: (msg: TReq) => Uint8Array;
  /** Функция десериализации из Protobuf */
  decode: (bytes: Uint8Array) => TRes;
  /** Базовый URL (например, "https://api.example.com") */
  baseUrl?: string;
}

/**
 * @ru Метаданные gRPC-запроса (заголовки и базовый URL).
 * @en gRPC request metadata (headers and base URL).
 */
export interface GrpcMetadata {
  headers?: Record<string, string>;
  baseUrl?: string;
}

/**
 * @ru Нормализованный ответ gRPC-вызова.
 * @en Normalized gRPC call response.
 */
export interface GrpcResponse<TRes = unknown> {
  /** Успешен ли вызов (HTTP 2xx и grpc-status === 0) */
  ok: boolean;
  grpcStatus: number;
  grpcMessage?: string;
  data: TRes;
  headers: Record<string, string>;
  trailers: Record<string, string>;
}

/**
 * @ru Разобранный unary gRPC-запрос на сервере. `message` — raw Protobuf payload
 * без 5-байтового gRPC-фрейма.
 * @en Parsed unary gRPC server request. `message` is the raw Protobuf payload
 * without the 5-byte gRPC frame.
 */
export interface GrpcServerRequest {
  readonly service: string;
  readonly method: string;
  readonly headers: Readonly<Record<string, string | string[]>>;
  readonly message: Uint8Array;
  readonly compressed: boolean;
}

/**
 * @ru Ответ серверного gRPC-обработчика. `body` — raw Protobuf payload;
 * ресивер сам добавляет gRPC-фрейм и trailers.
 * @en Server gRPC handler response. `body` is the raw Protobuf payload; the
 * receiver adds the gRPC frame and trailers.
 */
export interface GrpcServerResponse {
  readonly body?: Uint8Array;
  readonly grpcStatus?: number;
  readonly grpcMessage?: string;
  readonly headers?: Record<string, string>;
  readonly trailers?: Record<string, string>;
}

export interface GrpcRequestOptions {
  metadata?: GrpcMetadata;
  signal?: AbortSignal;
}

export type GrpcClientMethods = {
  call<TReq = unknown, TRes = unknown>(
    input: GrpcInput<TReq, TRes>,
    options?: GrpcRequestOptions,
  ): Promise<UniversalResponse<GrpcResponse<TRes>>>;
};

declare module "@hyperttp/types" {
  interface ProtocolInputMap {
    grpc: GrpcInput;
  }

  interface ProtocolMetadataMap {
    grpc: GrpcMetadata;
  }

  interface ProtocolServerRequestMap {
    grpc: GrpcServerRequest;
  }

  interface ProtocolServerResponseMap {
    grpc: GrpcServerResponse;
  }

  interface HyperProtocols {
    readonly grpc: GrpcClientMethods;
  }
}
