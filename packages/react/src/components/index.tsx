"use client";

import { type Settings, initialize } from "@open-iframe-resizer/core";
import { type IframeHTMLAttributes, useEffect, useRef } from "react";

interface Props extends IframeHTMLAttributes<HTMLIFrameElement>, Partial<Settings> {}

export function IframeResizer(props: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { settings, iframeAttributes } = filterProps(props);

  useEffect(() => {
    if (!iframeRef.current) {
      return;
    }
    const results = initialize(settings, iframeRef.current);
    return () => results.forEach((value) => value.unsubscribe());
  }, []);

  return <iframe {...iframeAttributes} ref={iframeRef} />;
}

function filterProps(props: Props): { iframeAttributes: IframeHTMLAttributes<HTMLIFrameElement>; settings: Partial<Settings> } {
  const { offsetSize, enableLegacyLibSupport, checkOrigin, onIframeResize, ...iframeAttributes } = props;

  // biome-ignore lint/suspicious/noExplicitAny: Only here to provide key exhaustiveness
  const settings: { [K in keyof Settings]: any } = { offsetSize, enableLegacyLibSupport, checkOrigin, onIframeResize };

  return { iframeAttributes, settings };
}
