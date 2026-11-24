import type {
  ProtocolRouteContext,
  ProtocolRouteHandler,
  ProtocolServerHost,
} from "@hyperttp/types";

export type GrpcRouteContext<Services> = ProtocolRouteContext<"grpc", Services>;

export interface GrpcServerMethods<Services, Server> {
  handle(handler: ProtocolRouteHandler<"grpc", Services>): Server;
}

declare module "@hyperttp/types" {
  interface HyperServerProtocols<_Services, _Server> {
    readonly grpc: GrpcServerMethods<_Services, _Server>;
  }
}

export function createGrpcServer<Services, Server>(
  host: ProtocolServerHost<Services, Server>,
): GrpcServerMethods<Services, Server> {
  return {
    handle(handler) {
      return host.configure<"grpc">({
        protocol: "grpc",
        handler: (request, context) => handler({ request, context, services: host.services }),
      });
    },
  };
}
