import { Component } from '@angular/core';
import { GameSceneComponent } from './game-scene/game-scene.component';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [GameSceneComponent],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss'
})
export class BodyComponent {


}
