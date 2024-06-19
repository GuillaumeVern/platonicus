import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class AnimateMorphService {
  clock = new THREE.Clock();
  morphSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  morphObservable: Observable<number> = this.morphSubject.asObservable();

  constructor() { }
  
  getMorphProgress() {
    return this.morphObservable;
  }

 animate() {
    // let morphProgress = 0;
    // while(morphProgress < 0.98) {
    //   morphProgress = THREE.MathUtils.damp(morphProgress, 1, 0.25, this.clock.getDelta());
    //   this.morphSubject.next(morphProgress);
    // }
    let morphProgress = 0;
let intervalId = setInterval(() => {
  morphProgress = THREE.MathUtils.damp(morphProgress, 1, 2, this.clock.getDelta());
  this.morphSubject.next(morphProgress);
  if (morphProgress >= 1) {
    morphProgress = 1;
    clearInterval(intervalId); // Stop the interval when the condition is met
  }
}, 10); // Run every 100 milliseconds
  }

  animateStep(morphProgress: number) {
    return 
  }

  
  
  cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
    return (
      Math.pow(1 - t, 3) * p0 +
      3 * Math.pow(1 - t, 2) * t * p1 +
      3 * (1 - t) * Math.pow(t, 2) * p2 +
      Math.pow(t, 3) * p3
    );
  }
}
