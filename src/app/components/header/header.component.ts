import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SubmitService } from '../../services/submit.service';
import { UserInfo } from '../../interfaces/user-info';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, RouterModule, FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  login_button_text: string = "Login/Register";
  userInfo: UserInfo | undefined;
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private submitService: SubmitService) { }

  ngOnInit() {


    this.changeMode();
    this.authService.auth.subscribe(() => {
      this.changeMode();
    });
  }

  changeMode() {
    this.login_button_text = "Login/Register";
    if (this.authService.isAuth) {
      this.login_button_text = "Logout";
    }
  }

}
