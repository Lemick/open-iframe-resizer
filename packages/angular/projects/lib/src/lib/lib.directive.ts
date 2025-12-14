import { type AfterViewInit, Directive, type ElementRef, Input, type OnDestroy } from "@angular/core";

import { type BeforeResizeContext, type InitializeResult, initialize, type ResizeContext, type Settings } from "@open-iframe-resizer/core";

@Directive({
  selector: "iframe[appOpenIframeResizer]",
  standalone: true,
})
export class IframeResizerDirective implements AfterViewInit, OnDestroy {
  constructor(private el: ElementRef<HTMLIFrameElement>) {}

  @Input() offsetSize?: number;
  @Input() enableLegacyLibSupport?: boolean;
  @Input() checkOrigin?: boolean;
  @Input() onIframeResize?: (context: ResizeContext) => void;
  @Input() onBeforeIframeResize?: (context: BeforeResizeContext) => boolean | undefined;
  @Input() targetElementSelector?: string;
  @Input() bodyMargin?: string;
  @Input() bodyPadding?: string;

  private unsubscribeIframeRef: InitializeResult[] = [];
  private isDestroyed = false;

  ngAfterViewInit(): void {
    const iframe = this.el.nativeElement;

    if (!iframe) {
      return;
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

    initialize(settings, iframe).then((results) => {
      if (this.isDestroyed) {
        for (const c of results) {
          c.unsubscribe();
        }
      } else {
        this.unsubscribeIframeRef = results;
      }
    });
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    for (const c of this.unsubscribeIframeRef) {
      c.unsubscribe();
    }
    this.unsubscribeIframeRef = [];
  }
}
