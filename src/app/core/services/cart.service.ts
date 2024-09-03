import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../environments/env';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private _HttpClient: HttpClient) {}

  myHeaders: any = { token: localStorage.getItem('userToken') };

  addToCart(id: string): Observable<any> {
    return this._HttpClient.post(`${env.baseURL}/api/v1/cart`, {
      productId: id,
    });
  }

  getUserCart(): Observable<any> {
    return this._HttpClient.get(`${env.baseURL}/api/v1/cart`);
  }

  removeCartItem(id: string): Observable<any> {
    return this._HttpClient.delete(`${env.baseURL}/api/v1/cart/${id}`);
  }

  updateCartQty(id: string, newQty: number): Observable<any> {
    return this._HttpClient.put(`${env.baseURL}/api/v1/cart/${id}`, {
      count: newQty,
    });
  }

  clearCart(): Observable<any> {
    return this._HttpClient.delete(`${env.baseURL}/api/v1/cart`);
  }
}
