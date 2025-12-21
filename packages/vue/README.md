# Open Iframe Resizer Vue

## Overview

`iframe-resizer` is a modern, lightweight library for resizing iframes dynamically. It is shipped under the MIT license, making it usable in commercial projects.

If you found this plugin helpful, please consider starring the repository!

## Getting Started


Install the package:
```bash
npm install @vvopen-iframe-resizer/vue
```

Wrap your iframes with it to resize them automatically:
```js
import { createApp } from "vue";
import { IframeResizer } from "@vvopen-iframe-resizer/vue";

const app = createApp({
  components: {
    IframeResizer,
  },
  template: `
      <div>
        <IframeResizer src=""https://github.com" />
      </div>
    `,
}).mount("#app");
```


