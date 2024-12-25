---
title: About the project
description: About the project
---

## Why another lib ?

The existing Iframe Resizer library is solid, but it's no longer usable for free in commercial projects.
I wanted to offer a modern alternative: focused on simplicity and efficiency.

- The library creates only one `ResizeObserver` to track the iframes, and does not rely on `MutationObserver` or `IntersectionObserver`, making it very lightweight.
- I try to keep the API as close as possible to the original library to ease migration, though some features will not be implemented the same way.
- Unified packaging: For simplicity, both the child and parent packages are included in the same module.

## Contributing
You can create issues on Github if you encounter any problems, you can also propose new features to integrate. 

:::tip
This library will always remain completely free and open-source.  
If you find it helpful, please consider starring the repository! ⭐
:::
