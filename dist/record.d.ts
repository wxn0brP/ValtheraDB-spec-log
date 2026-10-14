import { AnyRecord } from "./types.js";
export declare function encodeVarint(value: number): number[];
export declare function decodeVarint(buf: Buffer, offset: number): {
    value: number;
    bytesRead: number;
};
export declare function encodeDataRecord(_id: string, l: string): Buffer<ArrayBuffer>;
export declare function encodeTombstone(_id: string): Buffer<ArrayBuffer>;
export declare function decodeRecord(buf: Buffer, offset: number): {
    record: AnyRecord;
    bytesRead: number;
};
