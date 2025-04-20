<template>
  <iframe ref="iframe-ref" v-bind="$attrs"></iframe>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from "vue";
import { initialize, type InitializeResult, type Settings } from "@open-iframe-resizer/core";

const props = defineProps<Partial<Settings>>();

const iframeRef = useTemplateRef<HTMLIFrameElement | null>("iframe-ref");
let cleanupFunctions: InitializeResult[] = [];

const initializeResizer = (iframe: HTMLIFrameElement) => {
  // biome-ignore lint/suspicious/noExplicitAny: Compile fail if no key exhaustiveness
  const settings: Required<{ [K in keyof Settings]: any }> = {
    offsetSize: props.offsetSize,
    enableLegacyLibSupport: props.enableLegacyLibSupport,
    checkOrigin: props.checkOrigin,
    onIframeResize: props.onIframeResize,
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
</script>
