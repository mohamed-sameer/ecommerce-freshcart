import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../environments/env';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _HttpClient: HttpClient) {}
  private readonly _Router = inject(Router);
  userData: any = null;

  setRegisterForm(data: object): Observable<any> {
    return this._HttpClient.post(`${env.baseURL}/api/v1/auth/signup`, data);
  }
  setLoginForm(data: object): Observable<any> {
    return this._HttpClient.post(`${env.baseURL}/api/v1/auth/signin`, data);
  }

  saveUserData(): void {
    if (localStorage.getItem('userToken') !== null) {
      // the ! mark means the value should not be null
      this.userData = jwtDecode(localStorage.getItem('userToken')!);
      // console.log(this.userData);
    }
  }

  logOut(): void {
    localStorage.removeItem('userToken');
    this.userData = null;
    this._Router.navigate(['/login']);
  }

  setEmailVerify(data: object): Observable<any> {
    return this._HttpClient.post(
      `${env.baseURL}/api/v1/auth/forgotPasswords`,
      data
    );
  }

  setCodeVerify(data: object): Observable<any> {
    return this._HttpClient.post(
      `${env.baseURL}/api/v1/auth/verifyResetCode`,
      data
    );
  }

  setResetPassword(data: object): Observable<any> {
    return this._HttpClient.put(
      `${env.baseURL}/api/v1/auth/resetPassword`,
      data
    );
  }
}
