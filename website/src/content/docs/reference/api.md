---
title: API
description: Documentation of the API
---

### `initialize`


Called to automatically track iframes and resize the selected iframes when their inner content changes.

`settings` : A settings `object` for the selected iframes. Default settings will be applied if the settings object is empty.

`selector` : The `string` selector for the iframe(s) or the `HTMLIFrameElement` to be resized. If empty, all iframe elements in the document will be selected.

It returns an array of objects, which can be used to stop tracking an iframe.

#### Example 1
```js
// Track a specific iframe using its ID and customizing certain properties
initialize({
  bodyPadding: "0px",
  bodyMargin: "0px"
}, "#my-iframe");
```

#### Example 2
```js
// Track all existing iframes with default settings
const results = initialize();

// You can later untrack these iframes
results.forEach(result => result.unsubscribe());
```
--- 
## Settings

Below is a detailed description of each property:

### `offsetSize`

- **Type**: `number`
- **Description**: Offset added to the calculated resize size (in pixels).
- **Default**: `0`

### `checkOrigin`

- **Type**: `string[] | boolean`
- **Description**: Specifies whether to check the origin of incoming messages.
    - Accepts an array of allowed origins or a boolean.
    - If `true`, incoming messages are allowed from the origins of the registered iframes.
- **Default**: `true`

### `enableLegacyLibSupport`

- **Type**: `boolean`
- **Description**: Allows the library to communicate with a cross-origin child iframe containing the original "iframe-resizer" script. Useful if you do not control the child domain.
- **Default**: `false`

### `targetElementSelector`

- **Type**: `string | undefined`
- **Description**: By default, the root element observed for resizing is the `<html>` document. In more complex layouts, the scrolling container may be elsewhere. This setting allows you to customize the root element that should be observed for resize events.
- **Default**: `undefined`

### `bodyPadding`

- **Type**: `string | undefined`
- **Description**: Customize the padding style of the iframe body.
- **Default**: `undefined`

### `bodyMargin`

- **Type**: `string | undefined`
- **Description**: Customize the margin style of the iframe body.
- **Default**: `undefined`

### `onIframeResize`

- **Type**: `(context: ResizeContext) => void`
- **Description**: Listener that is called after the iframe has been resized. You can use a predefined handler like `updateParentScrollOnResize` create your own custom handler.
- **Default**: `undefined`

--- 
## Resize handlers

### `updateParentScrollOnResize` 

This handler attempts to fix the issue where the iframe is resized after interaction. 
For example, if your iframe contains a multi-step form where each step has a different height, the iframe might disappear from view after resizing.

If the iframe is focused, this handler will maintain the iframe's position in the viewport after a resize by scrolling.

```js
initialize({ onIframeResize: updateParentScrollOnResize }, "#myIframe");
```
