# IDB-Keyval

[![npm](https://img.shields.io/npm/v/@michaukrieg/idb-keyval.svg)](https://www.npmjs.com/package/@michaukrieg/idb-keyval)

This is a super-simple-small promise-based keyval store implemented with IndexedDB, largely based on [async-storage by Mozilla](https://github.com/mozilla-b2g/gaia/blob/master/shared/js/async_storage.js).

[localForage](https://github.com/localForage/localForage) offers similar functionality, but supports older browsers with broken/absent IDB implementations. Because of that, it's 7.4k, whereas idb-keyval is < 600 bytes. Also, it's tree-shaking friendly, so you'll probably end up using fewer than 500 bytes. Pick whichever works best for you!

This is only a keyval store. If you need to do more complex things like iteration & indexing, check out [IDB on NPM](https://www.npmjs.com/package/idb) (a little heavier at 1.7k). The first example in its README is how to recreate this library.

## Usage

### set

```js
import { set } from "@michaukrieg/idb-keyval";

set("hello", "world");
set("foo", "bar");
```

Since this is IDB-backed, you can store anything structured-clonable (numbers, arrays, objects, dates, blobs etc).

All methods return promises:

```js
import { set } from "@michaukrieg/idb-keyval";

set("hello", "world")
  .then(() => console.log("It worked!"))
  .catch((err) => console.log("It failed!", err));
```

### get

```js
import { get } from "@michaukrieg/idb-keyval";

// logs: "world"
get("hello").then((val) => console.log(val));
```

If there is no 'hello' key, then `val` will be `undefined`.

### getAll

```js
import { getAll } from "@michaukrieg/idb-keyval";

// logs: [ "bar", "world" ]
getAll().then((val) => console.log(val));
```

### keys

```js
import { keys } from "@michaukrieg/idb-keyval";

// logs: ["hello", "foo"]
keys().then((keys) => console.log(keys));
```

### del

```js
import { del } from "@michaukrieg/idb-keyval";

del("hello");
```

### clear

```js
import { clear } from "@michaukrieg/idb-keyval";

clear();
```

### Custom stores

By default, the methods above use an IndexedDB database named `keyval-store` and an object store named `keyval`. You can create your own store, and pass it as an additional parameter to any of the above methods:

```js
import { Store, set } from "@michaukrieg/idb-keyval";

const customStore = new Store("custom-db-name", "custom-store-name");
set("foo", "bar", customStore);
```

That's it!

## Installing

### Via npm + webpack/rollup

```sh
npm install @michaukrieg/idb-keyval
```

Now you can require/import `@michaukrieg/idb-keyval`:

```js
import { get, set } from "@michaukrieg/idb-keyval";
```

If you're targeting older versions of IE, you may have more luck with:

```js
const idb = require("@michaukrieg/idb-keyval/dist/idb-keyval-cjs-compat.min.js");
```

### Via `<script>`

- `dist/idb-keyval.js` is a valid JS module.
- `dist/idb-keyval-iife.js` can be used in browsers that don't support modules. `idbKeyval` is created as a global.
- `dist/idb-keyval-iife.min.js` As above, but minified.
- `dist/idb-keyval-iife-compat.min.js` As above, but works in older browsers such as IE 10.
- `dist/idb-keyval-amd.js` is an AMD module.
- `dist/idb-keyval-amd.min.js` As above, but minified.
