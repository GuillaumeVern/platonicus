import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserInfo } from '../../../interfaces/user-info';
import { jwtDecode } from 'jwt-decode';
import { SubmitService } from '../../../services/submit.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userInfo: UserInfo | undefined;
  fb: FormBuilder = new FormBuilder();

  userForm = this.fb.nonNullable.group({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    pseudo: new FormControl(''),
    highscore: new FormControl(''),
    gamesplayed: new FormControl('')
  });

  constructor(private submitService: SubmitService) {

  }

  get username() { return this.userForm.get('username')?.value; }
  get email() { return this.userForm.get('email')?.value; }
  get password() { return this.userForm.get('password')?.value; }
  get pseudo() { return this.userForm.get('pseudo')?.value; }
  get highscore() { return this.userForm.get('highscore')?.value; }
  get gamesplayed() { return this.userForm.get('gamesplayed')?.value; }

  ngOnInit() {

    this.submitService.getUserInfo(localStorage.getItem('token')).subscribe((data) => {
      this.userInfo = data;
      if (this.userInfo !== undefined) {
        this.userForm.setValue(this.userInfo);
      }
    });

  }

}
