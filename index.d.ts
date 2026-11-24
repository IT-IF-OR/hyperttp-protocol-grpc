import type { HyperProtocol } from "@hyperttp/types";
import type { GrpcInput, GrpcResponse, GrpcServerRequest, GrpcServerResponse } from "./types.js";
/**
 * @ru Единый gRPC-модуль протокола: клиентский Sender и серверный Receiver.
 * @en Unified gRPC protocol module: client Sender and server Receiver.
 */
export declare const GrpcProtocol: HyperProtocol<GrpcInput, GrpcResponse, GrpcServerRequest, GrpcServerResponse, "grpc">;
export * from "./types.js";
export * from "./sender.js";
export * from "./receiver.js";
export * from "./server.js";
export * from "./framing.js";
export * from "./test-transport.js";
