import IframeResizer from "./IframeResizer.vue";
import type { App } from "vue";

const IframeResizerPlugin = {
  install(app: App) {
    app.component("IframeResizer", IframeResizer);
  },
};

export { IframeResizer, IframeResizerPlugin };
