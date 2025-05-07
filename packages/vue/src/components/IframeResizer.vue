<template>
  <iframe ref="iframeRef" v-bind="$attrs"></iframe>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref, type PropType } from "vue";
import { initialize, type InitializeResult, type Settings } from "@open-iframe-resizer/core";

type Props = Partial<Settings>;

export default defineComponent(<Props>{
  name: "ResizableIframe",
  props: {
    offsetSize: [String, Number, Object] as PropType<Settings["offsetSize"]>,
    checkOrigin: [Boolean, Array] as PropType<Settings["checkOrigin"]>,
    onIframeResize: Function as PropType<Settings["onIframeResize"]>,
    onIframeContentObserved: Function as PropType<Settings["onIframeContentObserved"]>,
    targetElementSelector: [String] as PropType<Settings["targetElementSelector"]>,
    bodyMargin: [String, Number] as PropType<Settings["bodyMargin"]>,
    bodyPadding: [String, Number] as PropType<Settings["bodyPadding"]>,
    enableLegacyLibSupport: Boolean,
  },
  setup(props: Props, { attrs }: { attrs: Record<string, unknown> }) {
    const iframeRef = ref<HTMLIFrameElement | null>(null);
    let cleanupFunctions: InitializeResult[] = [];

    const initializeResizer = (iframe: HTMLIFrameElement) => {
      // biome-ignore lint/suspicious/noExplicitAny: Compile fail if no key exhaustiveness
      const settings: Required<{ [K in keyof Settings]: any }> = {
        offsetSize: props.offsetSize,
        enableLegacyLibSupport: props.enableLegacyLibSupport,
        checkOrigin: props.checkOrigin,
        onIframeResize: props.onIframeResize,
        onIframeContentObserved: props.onIframeContentObserved,
        targetElementSelector: props.targetElementSelector,
        bodyMargin: props.bodyMargin,
        bodyPadding: props.bodyPadding,
      };

      Object.keys(settings).forEach((key) => {
        if (settings[key as keyof Settings] === undefined) {
          delete settings[key as keyof Settings];
        }
      });

      cleanupFunctions = initialize(settings, iframe);
    };

    onMounted(() => {
      if (iframeRef.value) {
        initializeResizer(iframeRef.value);
      }
    });

    onBeforeUnmount(() => {
      cleanupFunctions.forEach((value) => value.unsubscribe());
      cleanupFunctions = [];
    });

    return {
      iframeRef,
      attrs,
    };
  },
});
</script>
