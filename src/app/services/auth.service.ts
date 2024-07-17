import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from '../interfaces/user-info';
import { SubmitService } from './submit.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth = new BehaviorSubject<boolean>(false);
  admin = new BehaviorSubject<boolean>(false);
  api_host = 'http://losvernos.com:4692';
  // api_host = 'http://localhost:8000';
  constructor(private router: Router, private http: HttpClient, private submitService: SubmitService) {
    this.checkCreds();

  }

  get isAuth(): boolean {
    return this.auth.getValue();
  }


  get isAdmin(): boolean {
    let token = localStorage.getItem('token');
    let userInfo!: UserInfo;
    if (token !== null) {
      this.submitService.getUserInfo(token).subscribe((data: UserInfo) => {
        userInfo = data;
      });
      if (userInfo?.username == "admin") {
        this.admin.next(true);
      }
    }
    return this.admin.getValue();
  }

  // returns http status code
  checkCreds(credentials: { username: string, password: string } | null = null) {
    if (credentials === null) {
      let token = localStorage.getItem('token');
      if (token !== null) {
        this.http.post(`${this.api_host}/auth/token`, { token: token })
          .pipe(
            catchError((error: any) => {
              return of(error);
            })
          ).subscribe((res: any) => {
            if (res.access_token === undefined) { // !ok
              this.logout();
            } else {
              localStorage.setItem('token', res.access_token);
              this.login();
              this.router.navigateByUrl('/home')
            }
          });
      }
    } else {
      this.http.post(`${this.api_host}/auth/login`, credentials)
        .pipe(
          catchError((error: any) => {
            return of(error);
          })
        ).subscribe((res: any) => {
          if (res.access_token === undefined) { // !ok
            this.logout();
          } else {
            localStorage.setItem('token', res.access_token);
            this.login();
          }
        })
    }
  }

  registerRequest(credentials: { username: string, password: string }) {
    this.http.post(`${this.api_host}/auth/register`, credentials)
      .pipe(
        catchError((error: any) => {
          return of(error);
        })
      ).subscribe((res: any) => {
        this.logout();
      });
  }

  login() {

    this.auth.next(true);
  }

  logout() {
    localStorage.removeItem('token');
    this.auth.next(false);
    this.router.navigateByUrl('/login');
  }
}
