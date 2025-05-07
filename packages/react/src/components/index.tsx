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
  const { offsetSize, enableLegacyLibSupport, checkOrigin, onIframeResize, onIframeContentObserved, targetElementSelector, bodyMargin, bodyPadding, ...iframeAttributes } = props;

  // biome-ignore lint/suspicious/noExplicitAny: Compile fail if no key exhaustiveness
  const settings: Required<{ [K in keyof Settings]: any }> = {
    offsetSize,
    enableLegacyLibSupport,
    checkOrigin,
    onIframeResize,
    onIframeContentObserved,
    targetElementSelector,
    bodyMargin,
    bodyPadding,
  };

  return { iframeAttributes, settings };
}
