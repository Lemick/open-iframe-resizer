import { debounce, getDefaultSettings, isHtmlIframeElement, isIframeSameOrigin } from "~/common";
import type { IframeResizeEvent, InitializeFunction, Settings } from "./type";

const resizeObserver = createResizeObserver();
const registeredIframes: Array<{ iframe: HTMLIFrameElement; settings: Settings }> = [];

const initialize: InitializeFunction = (clientSettings, selector) => {
	const finalSettings = { ...getDefaultSettings(), ...clientSettings };
	const iframes = resolveIframesToRegister(selector);
	const allowedOrigins = registerIframesAllowOrigins(finalSettings, iframes);

	return iframes.map((iframe) => {
		const length = registeredIframes.push({ iframe, settings: finalSettings });
		const unsubscribeResizeListener = addChildResizeListener(iframe, finalSettings, allowedOrigins);
		return {
			unsubscribe: () => {
				unsubscribeResizeListener();
				registeredIframes.splice(length - 1, 1);
			},
		};
	});
};

function resolveIframesToRegister(selector?: string | HTMLIFrameElement): HTMLIFrameElement[] {
	if (typeof selector === "string") {
		return Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(isHtmlIframeElement);
	}
	if (selector) {
		return isHtmlIframeElement(selector) ? [selector] : [];
	}
	return Array.from(document.getElementsByTagName("iframe"));
}

function registerIframesAllowOrigins(settings: Settings, iframes: HTMLIFrameElement[]) {
	if (Array.isArray(settings.checkOrigin)) {
		return settings.checkOrigin;
	}

	if (!settings.checkOrigin) {
		return [];
	}

	const allowedOrigins: string[] = [];
	for (const iframe of iframes) {
		const origin = extractIframeOrigin(iframe);
		if (origin) {
			allowedOrigins.push(origin);
		}
	}
	return allowedOrigins;
}

function extractIframeOrigin(iframe: HTMLIFrameElement): string | null {
	try {
		const origin = new URL(iframe.src).origin;
		if (origin !== "about:blank") {
			return origin;
		}
	} catch (error) {}
	return null;
}

function addChildResizeListener(iframe: HTMLIFrameElement, settings: Settings, allowedOrigins: string[]) {
	if (isIframeSameOrigin(iframe)) {
		return addSameOriginChildResizeListener(iframe);
	}
	return addCrossOriginChildResizeListener(iframe, settings, allowedOrigins);
}

function addCrossOriginChildResizeListener(iframe: HTMLIFrameElement, settings: Settings, allowedOrigins: string[]) {
	const handleIframeResizedMessage = (event: MessageEvent) => {
		const isOriginValid = !settings.checkOrigin || allowedOrigins.includes(event.origin);

		if (isOriginValid && event.data?.type === "iframe-resized" && iframe.contentWindow === event.source) {
			const { width, height } = (event as IframeResizeEvent).data;
			updateIframeDimensions({ width, height, iframe, settings });
		}
	};

	window.addEventListener("message", handleIframeResizedMessage, false);

	return () => window.removeEventListener("message", handleIframeResizedMessage, false);
}

function addSameOriginChildResizeListener(iframe: HTMLIFrameElement) {
	const startListener = () => {
		const contentBody = iframe.contentDocument?.body;

		if (!contentBody) {
			console.error("Unable to observe the iframe content document body");
			return;
		}

		resizeObserver.observe(contentBody);
	};

	iframe.addEventListener("load", startListener);

	return () => {
		if (iframe.contentDocument?.body) {
			resizeObserver.unobserve(iframe.contentDocument.body);
		}
		iframe.removeEventListener("load", startListener);
	};
}

function createResizeObserver() {
	const handleEntry = ({ target }: ResizeObserverEntry) => {
		const matchingRegisteredIframe = registeredIframes.find((value) => value.iframe.contentDocument?.body === target);
		if (!matchingRegisteredIframe) {
			return;
		}
		const { iframe, settings } = matchingRegisteredIframe;
		const { scrollHeight, scrollWidth } = iframe.contentDocument?.documentElement ?? {};
		if (scrollHeight !== undefined && scrollWidth !== undefined) {
			updateIframeDimensions({ width: scrollWidth, height: scrollHeight, iframe, settings });
		}
	};

	const resizeObserverCallback = debounce<ResizeObserverCallback>((entries) => entries.forEach(handleEntry), 10);
	return new ResizeObserver(resizeObserverCallback);
}

function updateIframeDimensions({ width, height, iframe, settings }: { iframe: HTMLIFrameElement; width: number; height: number; settings: Settings }) {
	iframe.style.width = `${width}px`;
	iframe.style.height = `${height + settings.offsetSize}px`;
}

export { initialize };
