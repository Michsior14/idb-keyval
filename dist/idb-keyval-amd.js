define(['exports'], function (exports) { 'use strict';

const promiseStore = (openreq, storeName) => new Promise((resolve, reject) => {
    openreq.onerror = () => reject(openreq.error);
    openreq.onsuccess = () => resolve(openreq.result);
    // First time setup: create an empty object store
    openreq.onupgradeneeded = () => {
        openreq.result.createObjectStore(storeName);
    };
});
class Store {
    constructor(dbName = "keyval-store", storeName = "keyval") {
        this.storeName = storeName;
        this._dbp = promiseStore(indexedDB.open(dbName), storeName).then((db) => {
            db.onversionchange = () => db.close();
            if (db.objectStoreNames.contains(storeName))
                return db;
            return promiseStore(indexedDB.open(dbName, db.version + 1), storeName);
        });
    }
    _withIDBStore(type, callback) {
        return this._dbp.then((db) => new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, type);
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
            transaction.onabort = (event) => reject(event.target.error);
            callback(transaction.objectStore(this.storeName));
        }));
    }
}
let store;
function getDefaultStore() {
    if (!store)
        store = new Store();
    return store;
}
function get(key, store = getDefaultStore()) {
    let req;
    return store
        ._withIDBStore("readonly", (store) => {
        req = store.get(key);
    })
        .then(() => req.result);
}
function getAll(store = getDefaultStore(), query, count) {
    let req;
    return store
        ._withIDBStore("readonly", (store) => {
        req = store.getAll(query, count);
    })
        .then(() => req.result);
}
function set(key, value, store = getDefaultStore()) {
    return store._withIDBStore("readwrite", (store) => {
        store.put(value, key);
    });
}
function del(key, store = getDefaultStore()) {
    return store._withIDBStore("readwrite", (store) => {
        store.delete(key);
    });
}
function clear(store = getDefaultStore()) {
    return store._withIDBStore("readwrite", (store) => {
        store.clear();
    });
}
function keys(store = getDefaultStore()) {
    const keys = [];
    return store
        ._withIDBStore("readonly", (store) => {
        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
        // And openKeyCursor isn't supported by Safari.
        (store.openKeyCursor || store.openCursor).call(store).onsuccess = function () {
            if (!this.result)
                return;
            keys.push(this.result.key);
            this.result.continue();
        };
    })
        .then(() => keys);
}

exports.Store = Store;
exports.get = get;
exports.getAll = getAll;
exports.set = set;
exports.del = del;
exports.clear = clear;
exports.keys = keys;

Object.defineProperty(exports, '__esModule', { value: true });

});
