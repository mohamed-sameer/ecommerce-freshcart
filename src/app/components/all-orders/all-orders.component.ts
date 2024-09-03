import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { IToken } from '../../core/interfaces/itoken';
import { CartItem, IAllOrder } from '../../core/interfaces/iall-orders';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TermTextPipe } from '../../core/pips/term-text.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-orders',
  standalone: true,
  imports: [DatePipe, TermTextPipe, CurrencyPipe],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.scss',
})
export class AllOrdersComponent implements OnInit, OnDestroy {
  private readonly _OrderService = inject(OrderService);
  private readonly _AuthService = inject(AuthService);
  userToken: IToken = {} as IToken;
  allUserOrders: IAllOrder[] = [{} as any];
  allUserOrdersSub!: Subscription;

  ngOnInit(): void {
    this.userToken = jwtDecode(localStorage.getItem('userToken')!);
    console.log(this.userToken.id);
    this.allUserOrdersSub = this._OrderService
      .allUserOrders(this.userToken.id)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.allUserOrders = res;
        },
      });
  }

  ngOnDestroy(): void {
    this.allUserOrdersSub?.unsubscribe();
  }
}
