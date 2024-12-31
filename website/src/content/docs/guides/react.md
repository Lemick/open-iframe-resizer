---
title: React Setup
description: Setup the React component
---

The library can also be used as a React component:

### Install the package

```bash
npm install @open-iframe-resizer/react
```

### Import the component

:::caution
If your iframe is on another domain, don't forget to load the script on the child page, more info [here](./cross-origin/).
:::

```jsx
import { IframeResizer } from "@open-iframe-resizer/react";

function YourComponent() {
  return (
    <div>
      <IframeResizer src="https://github.com" />
    </div>
  );
}
```

### Example

A full working project is also available [here](https://codesandbox.io/p/devbox/unruffled-curie-wpxgrd)

