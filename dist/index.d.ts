import { ValtheraClass } from "@wxn0brp/db-core";
import { Collection } from "@wxn0brp/db-core/helpers/collection";
import { LogAdapter } from "./adapter.js";
import { AnyRecord } from "./types.js";
export * from "./adapter.js";
export * from "./record.js";
export * from "./segment.js";
export type LogCollections<Tags extends string = string> = {
    [K in Tags]: Collection<AnyRecord>;
};
export declare function createLogValthera<Tags extends string = string>(rootDir: string): ValtheraClass & LogCollections<Tags>;
export declare const DYNAMIC: {
    def: (rootDir: string) => LogAdapter;
    log: (rootDir: string) => LogAdapter;
};
