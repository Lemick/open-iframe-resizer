import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LibComponent} from 'lib';

@Component({
  selector: 'app-root',
  imports: [LibComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'demo';
}
