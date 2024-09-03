import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './../../core/services/auth.service';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  // use the auth service to send data
  private readonly _AuthService = inject(AuthService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);
  msgError: string = '';
  isLoading: boolean = false;

  // using FormBuilder
  loginForm: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^\w{6,}$/)]],
  });

  loginSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      // console.log(this.loginForm.value);
      this._AuthService.setLoginForm(this.loginForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.message == 'success') {
            // save token
            localStorage.setItem('userToken', res.token);
            // decode token
            this._AuthService.saveUserData();
            this._Router.navigate(['/home']);
          }
          // console.log(res);
        },
        error: (err: HttpErrorResponse) => {
          this.msgError = err.error.message;
          this.isLoading = false;
          // console.log(err);
        },
      });
    } else {
      this.loginForm.setErrors({ mismatch: true });
      this.loginForm.markAllAsTouched();
    }
  }
}
