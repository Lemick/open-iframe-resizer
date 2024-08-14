import { type Settings, initialize } from "@open-iframe-resizer/core";
import { type IframeHTMLAttributes, useEffect, useRef } from "react";

interface Props extends IframeHTMLAttributes<HTMLIFrameElement>, Partial<Settings> {}

function IframeResizer(props: Props) {
	const iframeRef = useRef<HTMLIFrameElement>(null);

	useEffect(() => {
		if (!iframeRef.current) {
			return;
		}

		const results = initialize({}, iframeRef.current);
		return () => results.forEach((value) => value.unsubscribe());
	}, []);

	return <iframe {...props} ref={iframeRef} />;
}

export { IframeResizer };
