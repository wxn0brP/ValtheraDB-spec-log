import { FLAG_DELETED } from "./const.js";
export interface LogRecord {
    flag: number;
    _id: string;
    l: string;
}
export interface TombstoneRecord {
    flag: typeof FLAG_DELETED;
    _id: string;
}
export type AnyRecord = LogRecord | TombstoneRecord;
