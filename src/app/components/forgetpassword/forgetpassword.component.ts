import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgetpassword',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forgetpassword.component.html',
  styleUrl: './forgetpassword.component.scss',
})
export class ForgetpasswordComponent implements OnDestroy {
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);
  step: number = 1;

  verifyEmailSubmitSub!: Subscription;
  verifyCodeSubmitSub!: Subscription;
  resetPasswordSubmitSub!: Subscription;

  verifyEmail: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });
  verifyCode: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^\d{0,6}$/),
    ]),
  });
  resetPassword: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    newPassword: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^\w{6,}$/),
    ]),
  });

  verifyEmailSubmit(): void {
    let emailValue = this.verifyEmail.get('email')?.value;
    this.resetPassword.get('email')?.patchValue(emailValue);
    this.verifyCodeSubmitSub = this._AuthService
      .setEmailVerify(this.verifyEmail.value)
      .subscribe({
        next: (res) => {
          // console.log(res);
          if (res.statusMsg == 'success') {
            this.step = 2;
          }
        },
        error: (err) => console.log(err),
      });
  }

  verifyCodeSubmit(): void {
    this.verifyCodeSubmitSub = this._AuthService
      .setCodeVerify(this.verifyCode.value)
      .subscribe({
        next: (res) => {
          // console.log(res);
          if (res.status == 'Success') {
            this.step = 3;
          }
        },
        error: (err) => console.log(err),
      });
  }

  resetPasswordSubmit(): void {
    this.resetPasswordSubmitSub = this._AuthService
      .setResetPassword(this.resetPassword.value)
      .subscribe({
        next: (res) => {
          // console.log(res);
          localStorage.setItem('userToken', res.token);
          this._AuthService.saveUserData();
          this._Router.navigate(['/home']);
        },
        error: (err) => console.log(err),
      });
  }

  ngOnDestroy(): void {
    this.verifyEmailSubmitSub?.unsubscribe();
    this.verifyCodeSubmitSub?.unsubscribe();
    this.resetPasswordSubmitSub?.unsubscribe();
  }
}
