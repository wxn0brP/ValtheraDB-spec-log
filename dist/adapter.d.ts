import { ActionsBase } from "@wxn0brp/db-core/base/actions";
import { DataInternal } from "@wxn0brp/db-core/types/data";
import { VQueryT } from "@wxn0brp/db-core/types/query";
export declare class LogAdapter extends ActionsBase {
    private _segments;
    _inited: boolean;
    version: string;
    constructor(rootDir: string);
    init(): Promise<void>;
    close(): Promise<void>;
    [Symbol.asyncDispose](): Promise<void>;
    getCollections(): Promise<string[]>;
    issetCollection(collection: string): Promise<boolean>;
    ensureCollection(collection: string): Promise<boolean>;
    removeCollection(collection: string): Promise<boolean>;
    add(config: VQueryT.Add): Promise<{
        _id: string;
        l: string;
    }>;
    bulkAdd(config: VQueryT.BulkAdd): Promise<{
        _id: string;
        l: string;
    }[]>;
    find(config: VQueryT.Find): Promise<import("@wxn0brp/db-core/types/data").Data[]>;
    findOne(config: VQueryT.FindOne): Promise<DataInternal>;
    update(config: VQueryT.Update): Promise<DataInternal[]>;
    updateOne(config: VQueryT.Update): Promise<{
        _id: string;
        l: string;
    }>;
    remove(config: VQueryT.Remove): Promise<{
        _id: string;
        l: string;
    }[]>;
    removeOne(config: VQueryT.Remove): Promise<DataInternal>;
    count(config: VQueryT.Count): Promise<number>;
}
