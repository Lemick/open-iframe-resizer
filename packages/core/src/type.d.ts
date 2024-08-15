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
  offsetSize: number;
  checkOrigin: string[] | boolean;
};

export type IframeResizeEventData = {
  type: "iframe-resized";
  width: number;
  height: number;
};

export type IframeResizeEvent = MessageEvent<IframeResizeEventData>;
