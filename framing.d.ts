/**
 * @ru Упаковывает Protobuf-байты в 5-байтовый gRPC фрейм.
 */
export declare function encodeGrpcFrame(payload: Uint8Array, compressed?: boolean): Uint8Array;
/**
 * @ru Распаковывает 5-байтовый gRPC фрейм в сырые Protobuf-байты.
 */
export declare function decodeGrpcFrame(frame: Uint8Array): {
    compressed: boolean;
    payload: Uint8Array;
};
