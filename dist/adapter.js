import { ActionsBase } from "@wxn0brp/db-core/base/actions";
import { addId, addIdBulk } from "@wxn0brp/db-core/helpers/addId";
import { findUtil } from "@wxn0brp/db-core/utils/action";
import { findObj, matchObj, updateObj } from "@wxn0brp/db-core/utils/process";
import { FLAG_ALIVE, FLAG_DELETED } from "./const.js";
import { SegmentManager } from "./segment.js";
import { version } from "./version.js";
function normalizeLogDoc(data) {
    return {
        _id: String(data._id ?? ""),
        l: String(data.l ?? ""),
    };
}
function resolveRecords(records) {
    const alive = new Map();
    for (const rec of records) {
        if (rec.flag === FLAG_DELETED) {
            alive.delete(rec._id);
        }
        else if (rec.flag === FLAG_ALIVE) {
            alive.set(rec._id, {
                _id: rec._id,
                l: rec.l,
            });
        }
    }
    return Array.from(alive.values());
}
export class LogAdapter extends ActionsBase {
    _segments;
    _inited = false;
    version = version;
    constructor(rootDir) {
        super();
        this._segments = new SegmentManager(rootDir);
    }
    async init() {
        await this._segments.ensureCollection("__vdb_id");
        this._inited = true;
    }
    async close() {
        await this._segments.close();
    }
    [Symbol.asyncDispose]() {
        return this.close();
    }
    async getCollections() {
        const all = await this._segments.getCollections();
        return all.filter(c => c !== "__vdb_id");
    }
    async issetCollection(collection) {
        if (collection === "__vdb_id")
            return false;
        return await this._segments.issetCollection(collection);
    }
    async ensureCollection(collection) {
        if (collection === "__vdb_id")
            return false;
        const exists = await this._segments.issetCollection(collection);
        if (exists)
            return false;
        await this._segments.ensureCollection(collection);
        return true;
    }
    async removeCollection(collection) {
        if (collection === "__vdb_id")
            return false;
        await this._segments.removeCollection(collection);
        return true;
    }
    async add(config) {
        await this.ensureCollection(config.collection);
        await addId(config, this, true);
        const normalized = normalizeLogDoc(config.data);
        config.data = normalized;
        await this._segments.appendDataRecord(config.collection, normalized._id, normalized.l);
        return normalized;
    }
    async bulkAdd(config) {
        await this.ensureCollection(config.collection);
        await addIdBulk(config, this, true);
        const normalized = config.datas.map(d => normalizeLogDoc(d));
        config.datas = normalized;
        await this._segments.appendDataRecords(config.collection, normalized);
        return normalized;
    }
    async find(config) {
        await this.ensureCollection(config.collection);
        const records = await this._segments.scanCollection(config.collection);
        const alive = resolveRecords(records);
        const projected = alive
            .map(doc => findObj(config, doc))
            .filter((d) => d !== null);
        return findUtil(config, projected, []);
    }
    async findOne(config) {
        await this.ensureCollection(config.collection);
        const records = await this._segments.scanCollection(config.collection);
        const alive = resolveRecords(records);
        for (const doc of alive) {
            const result = findObj(config, doc);
            if (result)
                return result;
        }
        return null;
    }
    async update(config) {
        await this.ensureCollection(config.collection);
        const records = await this._segments.scanCollection(config.collection);
        const alive = resolveRecords(records);
        const matched = alive.filter(doc => matchObj(config, doc));
        if (matched.length === 0)
            return [];
        const results = [];
        for (const doc of matched) {
            const updated = updateObj(config, {
                ...doc,
            });
            const normalized = normalizeLogDoc(updated);
            await this._segments.appendTombstone(config.collection, doc._id);
            await this._segments.appendDataRecord(config.collection, normalized._id, normalized.l);
            results.push(normalized);
        }
        return results;
    }
    async updateOne(config) {
        await this.ensureCollection(config.collection);
        const records = await this._segments.scanCollection(config.collection);
        const alive = resolveRecords(records);
        for (const doc of alive) {
            const result = findObj(config, doc);
            if (result) {
                const updated = updateObj(config, {
                    ...doc,
                });
                const normalized = normalizeLogDoc(updated);
                await this._segments.appendTombstone(config.collection, doc._id);
                await this._segments.appendDataRecord(config.collection, normalized._id, normalized.l);
                return normalized;
            }
        }
        return null;
    }
    async remove(config) {
        await this.ensureCollection(config.collection);
        const records = await this._segments.scanCollection(config.collection);
        const alive = resolveRecords(records);
        const matched = alive.filter(doc => matchObj(config, doc));
        if (matched.length === 0)
            return [];
        for (const doc of matched) {
            await this._segments.appendTombstone(config.collection, doc._id);
        }
        return matched;
    }
    async removeOne(config) {
        await this.ensureCollection(config.collection);
        const records = await this._segments.scanCollection(config.collection);
        const alive = resolveRecords(records);
        for (const doc of alive) {
            const result = findObj(config, doc);
            if (result) {
                await this._segments.appendTombstone(config.collection, doc._id);
                return result;
            }
        }
        return null;
    }
    async count(config) {
        await this.ensureCollection(config.collection);
        const records = await this._segments.scanCollection(config.collection);
        const alive = resolveRecords(records);
        const matched = alive.filter(doc => matchObj(config, doc));
        return matched.length;
    }
}
