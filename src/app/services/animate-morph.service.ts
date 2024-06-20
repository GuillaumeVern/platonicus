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

}
