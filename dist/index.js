import { forgeTypedValthera, ValtheraClass } from "@wxn0brp/db-core";
import { LogAdapter } from "./adapter.js";
export * from "./adapter.js";
export * from "./record.js";
export * from "./segment.js";
export function createLogValthera(rootDir) {
    const adapter = new LogAdapter(rootDir);
    const db = new ValtheraClass({
        adapter,
    });
    return forgeTypedValthera(db);
}
export const DYNAMIC = {
    def: (rootDir) => new LogAdapter(rootDir),
    log: (rootDir) => new LogAdapter(rootDir),
};
