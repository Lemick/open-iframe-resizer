---
title: Getting started
description: Getting started with the open iframe resizer library
---

This library allows you to automatically resize iframes based on their content sizes. 
It prevents scrollbars from appearing in your iframe and enhances the user experience.

## Setup

:::caution
If you want to resize an iframe from a different origin than your own, please refer to the [Cross-Origin Section](./cross-origin/).
:::

### Browser (ES6 Modules)

```html
<script type="module">
  import { initialize } from "https://cdn.jsdelivr.net/npm/@open-iframe-resizer/core@v1.3.0/dist/index.min.js";

  initialize({}, "#my-iframe");
</script>
```

#### Example
You need to call the `initialize` function in the page that host the iframe(s) you want to resize:
<iframe src="https://codesandbox.io/embed/m655zt?view=editor&module=%2Findex.html" style="width:100%; height: 550px; border:0; border-radius: 4px; overflow:hidden;" title="open-iframe-resize-browser" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

### Package

Note you can also install the core package through [your favorite package tool](https://www.npmjs.com/package/@open-iframe-resizer/core):

```bash
npm install @open-iframe-resizer/core
```

## Further reading
- Explore the [settings](/reference/api)
