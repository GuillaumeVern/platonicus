import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from '../interfaces/user-info';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubmitService {
  api_host = 'http://localhost:8000';
  // api_host = 'http://losvernos.com:4692';
  constructor(private http: HttpClient) { }


  getUserInfo(token: string): Observable<UserInfo> {
    return this.http.get(`${this.api_host}/users/me`, { headers: { 'Authorization': `Bearer ${token}` } }) as Observable<UserInfo>;
  }

  getLeaderboard(token: string): Observable<UserInfo[]> {
    return this.http.get(`${this.api_host}/users/leaderboard`, { headers: { 'Authorization': `Bearer ${token}` } }) as Observable<UserInfo[]>;
  }

  addScore(token: string, score: number): void {
    this.http.post(`${this.api_host}/scores/add`, { score: score }, { headers: { 'Authorization': `Bearer ${token}` } }).subscribe();
  }


}
