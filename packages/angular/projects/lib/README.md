# Open Iframe Resizer Angular

## Overview

`iframe-resizer` is a modern, lightweight library for resizing iframes dynamically. It is shipped under the MIT license, making it usable in commercial projects.

If you found this plugin helpful, please consider starring the repository!

## Installation

```bash
npm install @open-iframe-resizer/angular
```

---

## Setup

Import the module in your Angular application:

```ts
import { IframeResizerDirective } from '@open-iframe-resizer/angular';

@Component({
  selector: "app-root",
  imports: [IframeResizerDirective, CommonModule],
  templateUrl: "./app.component.html",
})
```

---

## Usage

Add the directive to your iframe:

```html
<iframe
  oirIframeResizer
  src="/iframe-content.html"
></iframe>
```
