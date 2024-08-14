interface Window {
	iframeResizer: {
		initialize: InitializeFunction;
	};
}

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
