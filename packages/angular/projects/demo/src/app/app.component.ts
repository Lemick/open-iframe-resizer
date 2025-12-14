import { Component } from '@angular/core';
import {IframeResizerDirective} from 'lib';

@Component({
  selector: 'app-root',
  imports: [IframeResizerDirective],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'demo';
}
