"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  KeyvAdapter: () => KeyvAdapter,
  createCache: () => createCache
});
module.exports = __toCommonJS(index_exports);
var import_node_events = __toESM(require("events"), 1);
var import_utils = require("@cacheable/utils");
var import_keyv = require("keyv");

// src/keyv-adapter.ts
var KeyvAdapter = class {
  // biome-ignore lint/suspicious/noExplicitAny: type format
  opts;
  namespace;
  _cache;
  constructor(store) {
    this._cache = store;
  }
  async get(key) {
    const value = await this._cache.get(key);
    if (value !== void 0 && value !== null) {
      return value;
    }
    return void 0;
  }
  // biome-ignore lint/suspicious/noExplicitAny: type format
  async set(key, value, ttl) {
    await this._cache.set(key, value, ttl);
    return true;
  }
  async delete(key) {
    await this._cache.del(key);
    return true;
  }
  async clear() {
    return this._cache.reset?.();
  }
  async has(key) {
    const result = await this._cache.get(key);
    if (result) {
      return true;
    }
    return false;
  }
  async getMany(keys) {
    return this._cache.mget(...keys).then((values) => values.map((value) => value));
  }
  async deleteMany(key) {
    await this._cache.mdel(...key);
    return true;
  }
  /* c8 ignore next 5 */
  // biome-ignore lint/suspicious/noExplicitAny: type format
  on(event, listener) {
    this._cache.on?.(event, listener);
    return this;
  }
  async disconnect() {
    await this._cache.disconnect?.();
  }
};

// src/index.ts
var _storeLabel = (i) => i === 0 ? "primary" : `secondary:${i - 1}`;
var createCache = (options) => {
  const eventEmitter = new import_node_events.default();
  const keyv = new import_keyv.Keyv();
  keyv.serialize = void 0;
  keyv.deserialize = void 0;
  const stores = options?.stores?.length ? options.stores : [keyv];
  const nonBlocking = options?.nonBlocking ?? false;
  const _cacheId = options?.cacheId ?? Math.random().toString(36).slice(2);
  const get = async (key) => {
    let result;
    if (nonBlocking) {
      try {
        result = await Promise.race(
          stores.map(async (store) => store.get(key))
        );
        if (result === void 0) {
          return void 0;
        }
      } catch (error) {
        eventEmitter.emit("get", { key, error });
      }
    } else {
      for (let i = 0; i < stores.length; i++) {
        const store = stores[i];
        try {
          const cacheValue = await store.get(key);
          if (cacheValue !== void 0) {
            result = cacheValue;
            eventEmitter.emit("get", {
              key,
              value: result,
              store: _storeLabel(i)
            });
            break;
          }
        } catch (error) {
          eventEmitter.emit("get", { key, error, store: _storeLabel(i) });
        }
      }
    }
    return result;
  };
  const mget = async (keys) => {
    let result = keys.map(() => void 0);
    if (nonBlocking) {
      try {
        result = await Promise.race(
          stores.map(async (store) => store.getMany(keys))
        );
      } catch (error) {
        eventEmitter.emit("mget", { keys, error });
      }
    } else {
      for (const store of stores) {
        try {
          const missingValues = result.map(
            (value, index) => value === void 0 ? { originalIndex: index, key: keys[index] } : void 0
          ).filter((v) => v !== void 0);
          if (missingValues.length === 0) {
            break;
          }
          const missingKeys = missingValues.map((v) => v.key);
          const cacheValue = await store.getMany(missingKeys);
          for (const [index, value] of cacheValue.entries()) {
            if (value === void 0) {
              continue;
            }
            const { originalIndex } = missingValues[index];
            result[originalIndex] = value;
          }
        } catch (error) {
          eventEmitter.emit("mget", { keys, error });
        }
      }
    }
    eventEmitter.emit("mget", { keys, values: result });
    return result;
  };
  const ttl = async (key) => {
    let result;
    if (nonBlocking) {
      try {
        result = await Promise.race(
          stores.map(async (store) => store.get(key, { raw: true }))
        );
        if (result === void 0) {
          return void 0;
        }
      } catch (error) {
        eventEmitter.emit("ttl", { key, error });
      }
    } else {
      for (const store of stores) {
        try {
          const cacheValue = await store.get(key, { raw: true });
          if (cacheValue !== void 0) {
            result = cacheValue;
            eventEmitter.emit("ttl", { key, value: result });
            break;
          }
        } catch (error) {
          eventEmitter.emit("ttl", { key, error });
        }
      }
    }
    if (result?.expires) {
      return result.expires;
    }
    return void 0;
  };
  const set = async (stores2, key, value, ttl2) => {
    try {
      const promises = stores2.map(async (store, i) => {
        await store.set(key, value, ttl2 ?? options?.ttl);
        eventEmitter.emit("set", { key, value, store: _storeLabel(i) });
      });
      if (nonBlocking) {
        Promise.all(promises);
        eventEmitter.emit("set", { key, value });
        return value;
      }
      await Promise.all(promises);
      eventEmitter.emit("set", { key, value });
      return value;
    } catch (error) {
      eventEmitter.emit("set", { key, value, error });
      return Promise.reject(error);
    }
  };
  const mset = async (stores2, rawList) => {
    const list = rawList.map(({ key, value, ttl: ttl2 }) => ({
      key,
      value,
      ttl: ttl2 ?? options?.ttl
    }));
    try {
      const promises = stores2.map(async (store) => store.setMany(list));
      if (nonBlocking) {
        Promise.all(promises);
        eventEmitter.emit("mset", { list });
        return list;
      }
      await Promise.all(promises);
      eventEmitter.emit("mset", { list });
      return list;
    } catch (error) {
      eventEmitter.emit("mset", { list, error });
      return Promise.reject(error);
    }
  };
  const del = async (key) => {
    try {
      if (nonBlocking) {
        Promise.all(stores.map(async (store) => store.delete(key)));
        eventEmitter.emit("del", { key });
        return true;
      }
      await Promise.all(stores.map(async (store) => store.delete(key)));
      eventEmitter.emit("del", { key });
      return true;
    } catch (error) {
      eventEmitter.emit("del", { key, error });
      return Promise.reject(error);
    }
  };
  const mdel = async (keys) => {
    try {
      const promises = [];
      for (const key of keys) {
        promises.push(...stores.map(async (store) => store.delete(key)));
      }
      if (nonBlocking) {
        Promise.all(promises);
        eventEmitter.emit("mdel", { keys });
        return true;
      }
      await Promise.all(promises);
      eventEmitter.emit("mdel", { keys });
      return true;
    } catch (error) {
      eventEmitter.emit("mdel", { keys, error });
      return Promise.reject(error);
    }
  };
  const clear = async () => {
    try {
      if (nonBlocking) {
        Promise.all(stores.map(async (store) => store.clear()));
        eventEmitter.emit("clear");
        return true;
      }
      await Promise.all(stores.map(async (store) => store.clear()));
      eventEmitter.emit("clear");
      return true;
    } catch (error) {
      eventEmitter.emit("clear", error);
      return Promise.reject(error);
    }
  };
  const wrap = async (key, fnc, ttlOrOptions, refreshThresholdParameter) => (0, import_utils.coalesceAsync)(`${_cacheId}::${key}`, async () => {
    let value;
    let rawData;
    let i = 0;
    let remainingTtl;
    const { ttl: ttl2, refreshThreshold, raw } = (0, import_utils.isObject)(ttlOrOptions) ? ttlOrOptions : { ttl: ttlOrOptions, refreshThreshold: refreshThresholdParameter };
    const resolveTtl = (result) => (0, import_utils.runIfFn)(ttl2, result) ?? options?.ttl;
    for (; i < stores.length; i++) {
      try {
        const data = await stores[i].get(key, { raw: true });
        if (data !== void 0) {
          value = data.value;
          rawData = data;
          if (typeof data.expires === "number") {
            remainingTtl = Math.max(0, data.expires - Date.now());
          }
          break;
        }
      } catch {
      }
    }
    if (value === void 0) {
      const result = await fnc();
      const ttl3 = resolveTtl(result);
      await set(stores, key, result, ttl3);
      return raw ? { value: result, expires: Date.now() + ttl3 } : result;
    }
    const shouldRefresh = (0, import_utils.lessThan)(
      remainingTtl,
      (0, import_utils.runIfFn)(refreshThreshold, value) ?? options?.refreshThreshold
    );
    if (shouldRefresh) {
      (0, import_utils.coalesceAsync)(`+++${_cacheId}__${key}`, fnc).then(async (result) => {
        try {
          await set(
            options?.refreshAllStores ? stores : stores.slice(0, i + 1),
            key,
            result,
            resolveTtl(result)
          );
          eventEmitter.emit("refresh", { key, value: result });
        } catch (error) {
          eventEmitter.emit("refresh", { key, value, error });
        }
      }).catch((error) => {
        eventEmitter.emit("refresh", { key, value, error });
      });
    }
    if (!shouldRefresh && i > 0) {
      await set(stores.slice(0, i), key, value, resolveTtl(value));
    }
    return raw ? rawData : value;
  });
  const on = (event, listener) => eventEmitter.addListener(event, listener);
  const off = (event, listener) => eventEmitter.removeListener(event, listener);
  const disconnect = async () => {
    try {
      await Promise.all(stores.map(async (store) => store.disconnect()));
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const cacheId = () => _cacheId;
  return {
    get,
    mget,
    ttl,
    set: async (key, value, ttl2) => set(stores, key, value, ttl2),
    mset: async (list) => mset(stores, list),
    del,
    mdel,
    clear,
    wrap,
    on,
    off,
    disconnect,
    cacheId,
    stores
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  KeyvAdapter,
  createCache
});
/* v8 ignore next -- @preserve */
