import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //TODO: SET TO FALSE
  auth = new BehaviorSubject<boolean>(false);
  api_host = 'http://losvernos.com:4692';
  constructor(private router: Router, private http: HttpClient) {

  }

  get isAuth(): boolean {
    return this.auth.getValue();
  }

  // returns http status code
  checkCreds(credentials: { username: string, password: string }){
    //TODO : IMPLEMENT CHECK CREDS
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      this.login();
    }

    this.http.post(`${this.api_host}/auth/login`, credentials)
      .pipe(
        catchError((error: any) => {
          return of(error);
        })
    ).subscribe((res: any) => {
        if (res.access_token === undefined) { // !ok
          this.logout();
        } else {
          this.login();
        }
      })

  }

  registerRequest(credentials: { username: string, password: string }) {
    this.http.post(`${this.api_host}/auth/register`, credentials)
      .pipe(
        catchError((error: any) => {
          return of(error);
        })
    ).subscribe((res: any) => {
        console.log(res)
        if (res.status !== 201) { // created
          this.logout();
        } else {
          this.login();
        }
      });
  }

  login() {
    this.auth.next(true);
  }

  logout() {
    this.auth.next(false);
  }
}
