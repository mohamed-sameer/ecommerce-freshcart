import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../environments/env';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private _HttpClient: HttpClient) {}

  getAllProducts(): Observable<any> {
    return this._HttpClient.get(`${env.baseURL}/api/v1/products`);
  }

  getSpecificProduct(id: string | null): Observable<any> {
    return this._HttpClient.get(`${env.baseURL}/api/v1/products/${id}`);
  }

  addToWishlist(id: string): Observable<any> {
    return this._HttpClient.post(`${env.baseURL}/api/v1/wishlist`, {
      productId: id,
    });
  }

  getWishlist(): Observable<any> {
    return this._HttpClient.get(`${env.baseURL}/api/v1/wishlist`);
  }
}
