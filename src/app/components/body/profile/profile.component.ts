import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserInfo } from '../../../classes/user-info';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  token: any;
  userInfo: UserInfo;

  userForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    pseudo: new FormControl(''),
    highscore: new FormControl(''),
    latestscore: new FormControl(''),
    gamesplayed: new FormControl('')
  });

  constructor() {
    let token = localStorage.getItem('token');
    if (token !== null) {
      this.token = jwtDecode(token)
    }

    this.userInfo = new UserInfo(this.token.username, this.token.password)
  }

  ngOnInit() {
    console.log(this.userInfo);
    this.userForm.setValue(this.userInfo);
  }

}
