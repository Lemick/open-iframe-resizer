import { Component, Input, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import {initialize, type InitializeResult, ResizeContext, type BeforeResizeContext, type Settings} from '@open-iframe-resizer/core';

@Component({
  selector: 'app-iframe-resizer',
  template: `<iframe #iframe></iframe>`,
  standalone: true,
})
export class IframeResizerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('iframe', { static: true }) iframeRef!: ElementRef<HTMLIFrameElement>;

  @Input() iframeAttributes: { [key: string]: any } = {};

  @Input() offsetSize?: number;
  @Input() enableLegacyLibSupport?: boolean;
  @Input() checkOrigin?: boolean;
  @Input() onIframeResize?: (context: ResizeContext) => void;
  @Input() onBeforeIframeResize?: (context: BeforeResizeContext) => boolean | undefined;
  @Input() targetElementSelector?: string;
  @Input() bodyMargin?: string;
  @Input() bodyPadding?: string;

  private unsubscribeIframeRef: InitializeResult[] = [];
  private isUnmounted = false;

  ngAfterViewInit(): void {
    if (!this.iframeRef?.nativeElement) {
      return;
    }

    const iframeElement = this.iframeRef.nativeElement;

    for (const key in this.iframeAttributes) {
      if (this.iframeAttributes.hasOwnProperty(key)) {
        iframeElement.setAttribute(key, this.iframeAttributes[key]);
      }
    }

    const settings: Partial<Settings> = {
      offsetSize: this.offsetSize,
      enableLegacyLibSupport: this.enableLegacyLibSupport,
      checkOrigin: this.checkOrigin,
      onIframeResize: this.onIframeResize,
      onBeforeIframeResize: this.onBeforeIframeResize,
      targetElementSelector: this.targetElementSelector,
      bodyMargin: this.bodyMargin,
      bodyPadding: this.bodyPadding,
    };

    initialize(settings, this.iframeRef.nativeElement).then((results) => {
      if (this.isUnmounted) {
        results.forEach((c) => c.unsubscribe());
      } else {
        this.unsubscribeIframeRef = results;
      }
    });
  }

  ngOnDestroy(): void {
    this.isUnmounted = true;
    this.unsubscribeIframeRef?.forEach((c) => c.unsubscribe());
    this.unsubscribeIframeRef = [];
  }
}
