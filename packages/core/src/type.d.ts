/**
 * Automatically resize the selected iframes when their inner content grows.
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
   * Default: `0`
   */
  offsetSize: number;
  /**
   * Specifies whether to check the origin of incoming messages.
   * Accepts an array of allowed origins or a boolean.
   * If `true`, incoming messages are allowed from the origins of the registered iframes.
   *
   * Default: `true`
   */
  checkOrigin: string[] | boolean;
  /**
   * Allows the library to communicate with a cross-origin child iframe
   * containing the original "iframe-resizer" script.
   * Useful if you do not control the child domain.
   *
   * Default: `false`
   */
  enableLegacyLibSupport: boolean;
  /**
   * Listener that is called after the iframe has been resized.
   * You can use a predefined handler like `updateParentScrollOnResize` or create your own custom handler.
   *
   * Default: `undefined`
   */
  onIframeResize?: (context: ResizeContext) => void;
};

export type IframeResizeEventData = {
  type: "iframe-resized";
  width: number;
  height?: number;
};

export type IframeResizeEvent = MessageEvent<IframeResizeEventData>;

export type InteractionState = {
  isHovered: boolean;
};

export type ResizeRenderState = { rect: DOMRect };

export type ResizeContext = {
  iframe: HTMLIFrameElement;
  settings: Settings;
  interactionState: InteractionState;
  previousRenderState: ResizeRenderState;
  nextRenderState: ResizeRenderState;
};
