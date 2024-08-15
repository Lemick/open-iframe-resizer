# Open Iframe Resizer

## Overview

`iframe-resizer` is a modern, lightweight library for resizing iframes dynamically. It is shipped under the MIT license, making it usable in commercial projects.

If you found this plugin helpful, please consider starring the repository!

## Getting Started

### Browser (ES6 modules)

```html
<script type="module">
  import { initialize } from "https://cdn.jsdelivr.net/npm/@open-iframe-resizer/core@latest/dist/index.js";

  initialize({}, "#my-iframe");
</script>
```

You can found a working example [here](https://codesandbox.io/p/sandbox/open-iframe-resize-browser-m655zt)

## API
I decided to replicate the API from the well-known iframe-resizer library, as it may facilitate migration to this project (you only need to change the script).
## Browser support

| Chrome | Safari | Firefox | Opera | IE        |
|--------|--------|---------|-------|-----------|
| 64+    | 13.1+  | 69+     | 51+   | 🙅‍♂️ |
