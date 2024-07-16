import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../../services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatInputModule, MatFormFieldModule, MatButtonModule, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });
  loading: boolean = false;

  constructor(private router: Router,
    private authService: AuthService) { }
  
  ngOnInit() {
    this.authService.logout();
  }

  changeMode() {
    this.router.navigateByUrl('/register');
  }

  submit() {
    this.loading = true;
    this.authService.checkCreds(this.loginForm.value);
    this.authService.auth.subscribe((auth) => {
      console.log(auth);
      if (!auth) {
        this.loading = false;
        this.loginForm.setErrors({ invalid: true });
      } else {
        this.loading = false;
        this.router.navigateByUrl('/profile');
      }
    });
  }
}
