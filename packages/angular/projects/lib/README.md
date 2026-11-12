# Open Iframe Resizer Angular

## Overview

`iframe-resizer` is a modern, lightweight library for resizing iframes dynamically. It is shipped under the MIT license, making it usable in commercial projects.

If you found this plugin helpful, please consider starring the repository!

## Angular compatibility

Supports Angular 21 and 22 (`>=21.0.0 <23.0.0`). The published library is built with Angular 21 in partial compilation mode and tested against both supported major versions. Future Angular majors are added after validation.

## Installation

```bash
npm install @open-iframe-resizer/angular
```

---

## Setup

Import the standalone directive in your Angular component:

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
