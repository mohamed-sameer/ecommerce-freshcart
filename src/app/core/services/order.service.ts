import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../environments/env';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private _HttpClient: HttpClient) {}
  myHeaders: any = localStorage.getItem('userToken');

  checkout(cartId: string | null, shippingDetails: Object): Observable<any> {
    return this._HttpClient.post(
      `${env.baseURL}/api/v1/orders/checkout-session/${cartId}?url=${env.urlServer}`,
      {
        //prettier-ignore
        "shippingAddress": shippingDetails,
      }
    );
  }

  allUserOrders(cartId: string | null): Observable<any> {
    return this._HttpClient.get(`${env.baseURL}/api/v1/orders/user/${cartId}`);
  }
}
