import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from '../interfaces/user-info';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubmitService {
  // api_host = 'http://localhost:8000';
  api_host = 'http://losvernos.com:4692';
  constructor(private http: HttpClient) { }


  getUserInfo(token: any): Observable<UserInfo> {
    return this.http.get(`${this.api_host}/users/me`, { headers: { 'Authorization': `Bearer ${token}` } }) as Observable<UserInfo>;
  }


}
