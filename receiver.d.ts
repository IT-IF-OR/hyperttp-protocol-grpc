import type { HyperReceiver, ServerRequestContext, TransportRequest, TransportResponse } from "@hyperttp/types";
import type { GrpcServerRequest, GrpcServerResponse } from "./types.js";
export interface GrpcReceiverOptions {
    /** Application handler. When omitted, the core listen handler is used. */
    handler?: (request: GrpcServerRequest, ctx: ServerRequestContext) => GrpcServerResponse | Promise<GrpcServerResponse>;
    /** Maximum unary request message size in bytes. Default: 16 MiB. */
    maxMessageBytes?: number;
}
/**
 * @ru Минимальный unary gRPC-ресивер. Разбирает HTTP/2 запрос в service/method
 * и raw Protobuf payload, а ответ упаковывает в gRPC-фрейм и trailers.
 * @en Minimal unary gRPC receiver. Parses an HTTP/2 request into service/method
 * and a raw Protobuf payload, and frames the response with gRPC trailers.
 */
export declare class GrpcReceiver implements HyperReceiver<GrpcServerRequest, GrpcServerResponse, TransportRequest, TransportResponse, "grpc"> {
    readonly protocol = "grpc";
    private readonly handler?;
    private readonly maxMessageBytes;
    constructor(options?: GrpcReceiverOptions);
    receive(raw: TransportRequest, _ctx: ServerRequestContext): Promise<GrpcServerRequest>;
    handle(request: GrpcServerRequest, ctx: ServerRequestContext): GrpcServerResponse | Promise<GrpcServerResponse>;
    respond(response: GrpcServerResponse, _ctx: ServerRequestContext): TransportResponse;
}
