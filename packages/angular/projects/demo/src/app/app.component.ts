import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { IframeResizerDirective } from "lib";

@Component({
  selector: "app-root",
  imports: [IframeResizerDirective, CommonModule],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  iframeMounted: boolean = false;
  title = "demo";

  toggleIframe(): void {
    this.iframeMounted = !this.iframeMounted;
  }
}
