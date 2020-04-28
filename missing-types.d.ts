interface IDBObjectStore {
  openKeyCursor(range?: IDBKeyRange | IDBValidKey, direction?: IDBCursorDirection): IDBRequest;
  getAll(query?: IDBValidKey | IDBKeyRange, count?: number): IDBRequest;
}
