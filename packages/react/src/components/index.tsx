"use client";

import { initialize, type Settings } from "@open-iframe-resizer/core";
import { forwardRef, type IframeHTMLAttributes, useCallback, useEffect, useRef } from "react";

interface Props extends IframeHTMLAttributes<HTMLIFrameElement>, Partial<Settings> {}

export const IframeResizer = forwardRef<HTMLIFrameElement, Props>((props, forwardedRef) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { settings, iframeAttributes } = filterProps(props);

  useEffect(() => {
    if (!iframeRef.current) {
      return;
    }
    const results = initialize(settings, iframeRef.current);
    return () =>
      results.forEach((value) => {
        value.unsubscribe();
      });
  }, []);

  const composedRef = useCallback(
    (el: HTMLIFrameElement) => {
      iframeRef.current = el;

      if (typeof forwardedRef === "function") {
        forwardedRef(el);
      } else if (forwardedRef) {
        forwardedRef.current = el;
      }
    },
    [forwardedRef],
  );

  return <iframe {...iframeAttributes} ref={composedRef} />;
});

IframeResizer.displayName = "IframeResizer";

function filterProps(props: Props): { iframeAttributes: IframeHTMLAttributes<HTMLIFrameElement>; settings: Partial<Settings> } {
  const {
    offsetSize,
    enableLegacyLibSupport,
    checkOrigin,
    onIframeResize,
    onBeforeIframeResize,
    targetElementSelector,
    bodyMargin,
    bodyPadding,
    ...iframeAttributes
  } = props;

  // biome-ignore lint/suspicious/noExplicitAny: Compile fail if no key exhaustiveness
  const settings: Required<{ [K in keyof Settings]: any }> = {
    offsetSize,
    enableLegacyLibSupport,
    checkOrigin,
    onIframeResize,
    onBeforeIframeResize,
    targetElementSelector,
    bodyMargin,
    bodyPadding,
  };

  return { iframeAttributes, settings };
}
