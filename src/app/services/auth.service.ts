import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuth = new BehaviorSubject<boolean>(false);
  constructor() { }
}
