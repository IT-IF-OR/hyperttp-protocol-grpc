import type { HyperTransport, HyperProtocolName, TransportRequest, TransportResponse } from "@hyperttp/types";
export type GrpcHandler = (service: string, method: string, payload: Uint8Array) => {
    body: Uint8Array;
    grpcStatus?: number;
    grpcMessage?: string;
};
export interface GrpcTransportOptions {
    /**
     * @ru Кастомный список поддерживаемых протоколов.
     * @en Custom list of supported protocols.
     */
    protocols?: HyperProtocolName[];
}
/**
 * @ru Тестовый транспорт gRPC: вместо сети вызывает обработчик.
 * @en Test gRPC transport: invokes a handler instead of the network.
 */
export declare class GrpcTestTransport implements HyperTransport {
    readonly name = "grpc-test";
    readonly protocols: readonly HyperProtocolName[];
    private readonly handler;
    constructor(handler: GrpcHandler, options?: GrpcTransportOptions);
    execute(request: TransportRequest): Promise<TransportResponse>;
}
