import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatCardModule, MatInputModule, MatButtonModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  loading: boolean = false;
  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  constructor(private router: Router,
    private authService: AuthService
  ) {
    // Setting the custom validator to form
    this.registerForm.setValidators(this.checkPasswords);
  }

  /** Custom Validator checking for password match */
  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const matched = this.password === this.passwordConfirm;
    matched ? this.registerForm.controls['passwordConfirm'].setErrors(null) :
      this.registerForm.controls['passwordConfirm'].setErrors({ notSame: true });
    return matched ? null : { notSame: true }
  }

  get username() { return this.registerForm.get('username')?.value; }
  get password() { return this.registerForm.get('password')?.value; }
  get passwordConfirm() { return this.registerForm.get('passwordConfirm')?.value; }

  changeMode() {
    this.router.navigateByUrl("/login");
  }

  submit() {
    this.loading = true;
    this.authService.registerRequest({ username: this.username, password: this.password })
    this.authService.auth.subscribe((auth) => {
      if (auth) {
        this.loading = false;
        this.router.navigateByUrl('/profile');
      } else {
        this.loading = false;
        this.registerForm.setErrors({ invalid: true });
      }
    });
  }
}
