interface Window {
  iframeResizer: {
    initialize: InitializeFunction;
  };
}

/**
 * Automatically resizes the selected iframes.
 * @param settings The settings for the selected iframes. The default settings properties are picked if empty.
 * @param selector The selector for the iframe(s) or the HTMLIFrameElement to be resized. If empty, all document iframe elements will be selected.
 * @returns A result array, which can be used to clean up the listeners if you often remove iframes from the document.
 */
export type InitializeFunction = (settings?: Partial<Settings>, selector?: string | HTMLIFrameElement) => InitializeResult[];
export type InitializeResult = { unsubscribe: () => void };

export type Settings = {
  /**
   * Offset added to the resize size (in pixels).
   *
   * Default: 0
   */
  offsetSize: number;
  /**
   * Specifies whether to check the origin of incoming messages.
   * Accepts an array of allowed origins or a boolean.
   * If true, incoming messages are allowed from the origins of the registered iframes.
   *
   * Default: true
   */
  checkOrigin: string[] | boolean;
  /**
   * Allows the library to communicate with a cross-origin child iframe
   * containing the original "iframe-resizer" script.
   * Useful if you do not control the child domain.
   *
   * Default: false
   */
  enableLegacyLibSupport: boolean;
};

export type IframeResizeEventData = {
  type: "iframe-resized";
  width: number;
  height?: number;
};

export type IframeResizeEvent = MessageEvent<IframeResizeEventData>;
