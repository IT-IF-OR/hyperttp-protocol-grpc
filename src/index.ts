import type { HyperProtocol } from "@hyperttp/types";
import { GrpcReceiver } from "./receiver.js";
import { GrpcSender } from "./sender.js";
import { createGrpcServer } from "./server.js";
import type { GrpcInput, GrpcResponse, GrpcServerRequest, GrpcServerResponse } from "./types.js";

/**
 * @ru Единый gRPC-модуль протокола: клиентский Sender и серверный Receiver.
 * @en Unified gRPC protocol module: client Sender and server Receiver.
 */
export const GrpcProtocol: HyperProtocol<
  GrpcInput,
  GrpcResponse,
  GrpcServerRequest,
  GrpcServerResponse,
  "grpc"
> = {
  protocol: "grpc",
  name: "GrpcProtocol",
  server: createGrpcServer,
  sender: new GrpcSender(),
  receiver: new GrpcReceiver(),
};

export * from "./types.js";
export * from "./sender.js";
export * from "./receiver.js";
export * from "./server.js";
export * from "./framing.js";
export * from "./test-transport.js";
