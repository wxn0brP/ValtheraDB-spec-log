import { AnyRecord } from "./types.js";
export declare class SegmentManager {
    private rootDir;
    private _activeFh;
    private _activeOffset;
    constructor(rootDir: string);
    private _collectionDir;
    private _segmentPath;
    ensureCollection(collection: string): Promise<void>;
    issetCollection(collection: string): Promise<boolean>;
    getCollections(): Promise<string[]>;
    removeCollection(collection: string): Promise<void>;
    private _getNextSegmentIndex;
    private _getActiveHandle;
    appendDataRecord(collection: string, _id: string, l: string): Promise<void>;
    appendTombstone(collection: string, _id: string): Promise<void>;
    appendDataRecords(collection: string, records: {
        _id: string;
        l: string;
    }[]): Promise<void>;
    scanCollection(collection: string): Promise<AnyRecord[]>;
    close(): Promise<void>;
}
