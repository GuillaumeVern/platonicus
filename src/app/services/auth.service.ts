import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //TODO: SET TO FALSE
  auth = new BehaviorSubject<boolean>(true);
  constructor(private router: Router) { }

  get isAuth(): boolean {
    return this.auth.getValue();
  }

  async checkCreds(credentials: { username: string, password: string }) {
    //TODO : IMPLEMENT CHECK CREDS
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      this.login();
      this.router.navigateByUrl('/home');
      return true;
    }
    else {
      this.logout();
      return false;
    }
  }

  registerRequest(credentials: { username: string, password: string }) {
    return false;
    //TODO : IMPLEMENT REGISTER REQUEST
  }

  login() {
    this.auth.next(true);
  }

  logout() {
    this.auth.next(false);
  }
}
