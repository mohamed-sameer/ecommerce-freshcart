import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { ICart } from '../../core/interfaces/icart';
import { CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit, OnDestroy {
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  getUserCartSub!: Subscription;
  removeCartItemSub!: Subscription;
  updataQtySub!: Subscription;
  clearCartSub!: Subscription;
  userCart: ICart = {} as ICart;

  ngOnInit(): void {
    this.getUserCartSub = this._CartService.getUserCart().subscribe({
      next: (res) => {
        console.log(res.data);
        this.userCart = res.data;
      },
    });
  }

  deleteItem(id: string): void {
    this.removeCartItemSub = this._CartService.removeCartItem(id).subscribe({
      next: (res) => {
        // console.log(res);
        this.userCart = res.data;
        this._ToastrService.error('Item Deleted');
      },
    });
  }

  updateQty(id: string, qty: number): void {
    if (qty > 0) {
      this.updataQtySub = this._CartService.updateCartQty(id, qty).subscribe({
        next: (res) => {
          // console.log(res.data);
          this.userCart = res.data;
        },
      });
    } else {
      this.deleteItem(id);
    }
  }

  clearCart(): void {
    this.clearCartSub = this._CartService.clearCart().subscribe({
      next: (res) => {
        console.log(res);
        if (res.message == 'success') {
          this.userCart = {} as ICart;
          this._ToastrService.success(
            `${res.message}: Cart Cleared`,
            'FreshCart'
          );
        }
      },
    });
  }

  ngOnDestroy(): void {
    // this.getUserCartSub.unsubscribe();
    // this.removeCartItemSub.unsubscribe();
    // this.updataQtySub.unsubscribe();
    // this.clearCartSub.unsubscribe();
  }
}
