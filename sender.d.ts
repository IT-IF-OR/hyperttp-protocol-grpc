import type { HyperSender, HyperTransport, RequestContext, SendRequest, TransportRequest, TransportResponse, UniversalResponse } from "@hyperttp/types";
import type { GrpcInput, GrpcResponse } from "./types.js";
/**
 * @ru Опции инициализации gRPC-сендера.
 * @en Initialization options for the gRPC sender.
 */
export interface GrpcSenderOptions {
    /** Базовый URL по умолчанию для всех вызовов. */
    baseUrl?: string;
    transport?: HyperTransport;
    [key: string]: unknown;
}
/**
 * @ru gRPC протокольный сендер. Реализует трёхфазный цикл prepare → send → parse:
 * кодирует Protobuf-сообщение в 5-байтовый gRPC фрейм, отправляет через транспорт
 * и декодирует ответ обратно.
 * @en gRPC protocol sender. Implements the three-phase cycle prepare → send → parse:
 * encodes the Protobuf message into a 5-byte gRPC frame, sends it through the
 * transport, and decodes the response back.
 */
export declare class GrpcSender implements HyperSender<GrpcInput, GrpcResponse, TransportRequest, TransportResponse> {
    readonly protocol = "grpc";
    readonly methods: Readonly<Record<string, (...args: any[]) => any>>;
    private readonly options?;
    constructor(options?: GrpcSenderOptions);
    /**
     * Фаза 1: PREPARE
     * Превращает gRPC Input в подготовленный бинарный TransportRequest.
     */
    prepare(request: SendRequest<GrpcInput, string>, ctx: RequestContext): TransportRequest;
    /**
     * Фаза 2: SEND
     */
    send(prepared: TransportRequest, transport: HyperTransport, _ctx: RequestContext): Promise<TransportResponse>;
    /**
     * Фаза 3: PARSE
     * Распаковывает фрейм, проверяет grpc-status и декодирует Protobuf.
     */
    parse(raw: TransportResponse, ctx: RequestContext): UniversalResponse<GrpcResponse<unknown>>;
    private dispatch;
    private flattenHeaders;
    private decodeGrpcMessage;
    private toBytes;
}
