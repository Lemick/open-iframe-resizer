/**
 * Automatically resize the selected iframes when their inner content grows.
 * @param settings The settings for the selected iframes. The default settings properties are picked if empty.
 * @param selector The selector for the iframe(s) or the HTMLIFrameElement to be resized. If empty, all document iframe elements will be selected.
 * @returns A result array Promise, which can be used to clean up the listeners if you remove iframes from the document and want to clean all associated listeners.
 */
export type InitializeFunction = (settings?: Partial<Settings>, selector?: string | HTMLIFrameElement) => Promise<InitializeResult[]>;
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
   * By default, the root element observed for resizing is the <html> document.
   * In more complex layouts, the scrolling container may be elsewhere.
   * This setting allows you to customize the root element that should be observed for resize events.
   *
   * Default: `undefined`
   */
  targetElementSelector?: string;

  /**
   * Customize the padding style of the iframe body.
   *
   * Default: `undefined`
   */
  bodyPadding?: string;

  /**
   * Customize the margin style of the iframe body.
   *
   * Default: `undefined`
   */
  bodyMargin?: string;

  /**
   * Called whenever the observed content size changes and the iframe is about to be resized.
   * Return `false` to cancel the resize; returning `true` or nothing will allow it.
   *
   * Default: `undefined`
   */
  onBeforeIframeResize?: (context: BeforeResizeContext) => boolean | undefined;

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

export type IframeChildInitEventData = {
  type: "iframe-child-init";
  targetElementSelector?: string;
  bodyPadding?: string;
  bodyMargin?: string;
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

export type BeforeResizeContext = {
  iframe: HTMLIFrameElement;
  settings: Settings;
  observedHeight: number;
};

export type RegisteredElement = {
  iframe: HTMLIFrameElement;
  settings: Settings;
  interactionState: InteractionState;
  initContext: { isInitialized: boolean; retryAttempts: number; retryTimeoutId?: number };
};
