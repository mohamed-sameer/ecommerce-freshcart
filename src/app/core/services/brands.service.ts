import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../environments/env';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  constructor(private _HttpClient: HttpClient) {}

  getAllBrands(): Observable<any> {
    return this._HttpClient.get(`${env.baseURL}/api/v1/brands`);
  }

  getSpecificBrands(id: string): Observable<any> {
    return this._HttpClient.get(`${env.baseURL}/api/v1/brands/${id}`);
  }
}
