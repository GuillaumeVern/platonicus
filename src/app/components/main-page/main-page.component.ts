import { Component } from '@angular/core';
import { BodyComponent } from '../body/body.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [BodyComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {}
