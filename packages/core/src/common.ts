import type { Settings } from "~/type";

const isInIframe = () => window && window.self !== window.top;

const isSameOriginIframe = (iframe: HTMLIFrameElement): iframe is HTMLIFrameElement & { contentDocument: Document } => !!iframe.contentDocument;

const isHtmlIframeElement = (element: Element): element is HTMLIFrameElement => element instanceof HTMLIFrameElement;

const deferWhenDomContentIsLoaded = (document: Document, executable: () => void) => {
	document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", executable) : executable();
};

const deferWhenPageIsLoaded = (document: Document, executable: () => void) => {
	document.readyState !== "complete" ? document.addEventListener("load", executable) : executable();
};

const getDefaultSettings: () => Settings = () => ({ offsetSize: 0, checkOrigin: true });

const isIframeSameOrigin = (iframe: HTMLIFrameElement) => {
	try {
		const iframeSrc = new URL(iframe.src, window.location.origin);
		return iframeSrc.origin === window.location.origin;
	} catch (e) {
		return false;
	}
};

// biome-ignore lint/suspicious/noExplicitAny:
function debounce<T extends (...args: any[]) => any>(f: T, delay: number) {
	let timer: NodeJS.Timeout;
	return (...args: unknown[]) => {
		clearTimeout(timer);
		timer = setTimeout(() => f.apply(undefined, args), delay);
	};
}

export {
	isInIframe,
	isSameOriginIframe,
	deferWhenDomContentIsLoaded,
	isHtmlIframeElement,
	deferWhenPageIsLoaded,
	isIframeSameOrigin,
	debounce,
	getDefaultSettings,
};
