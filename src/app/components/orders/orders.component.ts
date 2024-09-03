import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit, OnDestroy {
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _OrderService = inject(OrderService);

  ActivatedRouteSub!: Subscription;
  checkoutSub!: Subscription;

  cartId: string | null = '';

  orders: FormGroup = this._FormBuilder.group({
    details: [null, [Validators.required]],
    phone: [
      null,
      [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
    ],
    city: [null, [Validators.required]],
  });

  ngOnInit(): void {
    this.ActivatedRouteSub = this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        this.cartId = params.get('id');
      },
    });
  }

  orderSubmit(): void {
    // console.log(this.orders.value);
    this.checkoutSub = this._OrderService
      .checkout(this.cartId, this.orders.value)
      .subscribe({
        next: (res) => {
          // console.log(res);
          if (res.status === 'success') {
            let stripeUrl = res.session.url;
            window.open(stripeUrl);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.ActivatedRouteSub?.unsubscribe();
    this.checkoutSub?.unsubscribe();
  }
}
