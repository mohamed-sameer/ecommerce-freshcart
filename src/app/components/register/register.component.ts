import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './../../core/services/auth.service';
import { Component, inject, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnDestroy {
  // use the auth service to send data
  private readonly _AuthService = inject(AuthService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);
  msgError: string = '';
  isLoading: boolean = false;
  registerSub!: Subscription;

  // using FormBuilder
  registerForm: FormGroup = this._FormBuilder.group(
    {
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/^\w{6,}$/)]],
      rePassword: [null],
      phone: [
        null,
        [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
      ],
    },
    { validators: this.confirmPassword }
  );

  // old way
  // registerForm: FormGroup = new FormGroup(
  //   {
  //     name: new FormControl(null, [
  //       Validators.required,
  //       Validators.minLength(3),
  //       Validators.maxLength(20),
  //     ]),
  //     email: new FormControl(null, [Validators.required, Validators.email]),
  //     password: new FormControl(null, [
  //       Validators.required,
  //       Validators.pattern(/^\w{6,}$/),
  //     ]),
  //     rePassword: new FormControl(null),
  //     phone: new FormControl(null, [
  //       Validators.required,
  //       Validators.pattern(/^01[0125][0-9]{8}$/),
  //     ]),
  //   },
  //   this.confirmPassword
  // );

  confirmPassword(inputData: AbstractControl) {
    if (
      inputData.get('password')?.value === inputData.get('rePassword')?.value
    ) {
      return null;
    } else {
      return { mismatch: true };
    }
  }

  registerSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      // console.log(this.registerForm.value);
      this.registerSub = this._AuthService
        .setRegisterForm(this.registerForm.value)
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            if (res.message == 'success') {
              this._Router.navigate(['/login']);
            }
          },
          error: (err: HttpErrorResponse) => {
            this.msgError = err.error.message;
            this.isLoading = false;
          },
        });
    } else {
      this.registerForm.setErrors({ mismatch: true });
      this.registerForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.registerSub?.unsubscribe();
  }
}
