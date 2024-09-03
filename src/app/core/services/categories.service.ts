import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../environments/env';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private _HttpClient: HttpClient) {}

  getAllCategories(): Observable<any> {
    return this._HttpClient.get(`${env.baseURL}/api/v1/categories`);
  }
  // get specfic category
  getSpecificCategory(id: string): Observable<any> {
    return this._HttpClient.get(`${env.baseURL}/api/v1/categories/${id}`);
  }
}
