---
title: Cross-Origin setup
description: How to configure the library with a cross-origin iframe  
---

Iframes behave differently when the source domain is not the same as the parent page. For example, the page containing the iframe might be
accessible via the URL `https://my-website.com/index.html`, while the iframe you are loading resides at `https://another-domain.com/index.html`.

In such cases, the iframe's content document is not directly accessible for security reasons.
This is why you must load the script in the parent page **and** the child page.

### Parent Setup

In the parent page, register the iframe you want to resize:

<iframe src="https://codesandbox.io/embed/xj24pg?view=editor" style="width:100%; height: 680px; border:0; border-radius: 8px; overflow:hidden;" title="cross-origin open-iframe-resizer" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

### Child Setup

In the child page, the key requirement is that you also need to load the script.

:::note
Note that you do not need to call the initialization function in the child, simply loading the module is sufficient.
:::

<iframe src="https://codesandbox.io/embed/msv4hr?view=editor&module=%2Findex.html" style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;" title="growing-iframe" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

## What if I have no control over the child domain?

If you do not have control over the child iframe's domain, but the child page happens to load the legacy `iframe-resizer` script,
you can initialize the library in compatibility mode. This will attempt to connect to the child iframe:

```javascript
initialize({ enableLegacyLibSupport: true }, "#my-iframe");
  ```

