# Open Iframe Resizer

![NPM Version](https://img.shields.io/npm/v/%40open-iframe-resizer%2Fcore)
![NPM License](https://img.shields.io/npm/l/%40open-iframe-resizer%2Fcore)
[![](https://data.jsdelivr.com/v1/package/npm/@open-iframe-resizer/core/badge)](https://www.jsdelivr.com/package/npm/@open-iframe-resizer/core)

## Overview

A modern, lightweight alternative for resizing iframes dynamically. It is shipped under the MIT license, making it usable in commercial projects.

If you found this plugin helpful, please consider starring the repository!

## Getting Started

### Browser (ES6 modules)

```html

<script type="module">
  import { initialize } from "https://cdn.jsdelivr.net/npm/@open-iframe-resizer/core@latest/dist/index.min.js";

  initialize({}, "#my-iframe");
</script>
```

You can found a working example [here](https://codesandbox.io/p/sandbox/open-iframe-resize-browser-m655zt)

### Package

Note you can also install the core package through [npm](https://www.npmjs.com/package/@open-iframe-resizer/core):

```bash
npm install @open-iframe-resizer/core
```

### React

A React component is also available:

```bash
npm install @open-iframe-resizer/react
```

## Notes

### Performing actions after a resize

You can execute a custom function after an iframe has been resized. Also, you can use built-in functions
like `updateParentScrollOnResize` to help keep the iframe within the viewport after resizing:

```javascript
import { initialize, updateParentScrollOnResize } from "https://cdn.jsdelivr.net/npm/@open-iframe-resizer/core@latest/dist/index.min.js";

initialize({ onIframeResize: updateParentScrollOnResize }, "#myIframe");
```

### Resize iframes from a different origin

- If you have control over the embedded page, you need to load the script on your child page to enable messaging between the two windows (you do not need to call the initialize function in the child;
  loading the module is sufficient).

  Here is an example of the [parent page](https://codesandbox.io/p/sandbox/xj24pg) and the [child](https://codesandbox.io/p/sandbox/growing-iframe-msv4hr).


- If you have no control over the child iframe domain, and, by chance, the child page loads the legacy *iframe-resizer* script, you can initialize the library with the compatibility mode; it will try
  to connect to the child iframe:
  ```javascript
  initialize({ enableLegacyLibSupport: true }, "#my-iframe");
  ```

### Comparison with iframe-resizer

This library is very good, but it has changed its license, so it is no longer usable in closed-source projects for free.
I decided to replicate some parts of the API, as it may facilitate migration to this project.

Some features from this library are missing, but they could be implemented in future versions.

## Browser support

| Chrome | Safari | Firefox | Opera | IE    |
|--------|--------|---------|-------|-------|
| 64+    | 13.1+  | 69+     | 51+   | 🙅‍♂️ |
