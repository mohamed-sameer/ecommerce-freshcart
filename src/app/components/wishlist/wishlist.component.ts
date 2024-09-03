import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { IProduct } from '../../core/interfaces/iproduct';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { TermTextPipe } from '../../core/pips/term-text.pipe';
import { IWishlist } from '../../core/interfaces/iwishlist';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink, TermTextPipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent implements OnInit, OnDestroy {
  private readonly _ProductsService = inject(ProductsService);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);

  getWishlistSub!: Subscription;
  addToCartSub!: Subscription;
  addToWishlistSub!: Subscription;

  userWishlist: IProduct[] = [];
  getUserWishlist: IWishlist[] = [];

  ngOnInit(): void {
    this.getWishlistSub = this._ProductsService.getWishlist().subscribe({
      next: (res) => {
        console.log(res);
        this.userWishlist = res.data;
      },
    });
  }

  addToCart(id: string): void {
    this.addToCartSub = this._CartService.addToCart(id).subscribe({
      next: (res) => {
        // console.log(res);
        this._ToastrService.success(res.message, 'FreshCart');
      },
    });
  }

  addToWishlist(id: string): void {
    this.addToWishlistSub = this._ProductsService.addToWishlist(id).subscribe({
      next: (res) => {
        // console.log(res);
        if (res.status === 'success') {
          this.getUserWishlist = res.data;
          this._ToastrService.success(res.message, 'FreshCart');
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.getWishlistSub?.unsubscribe();
    this.addToCartSub?.unsubscribe();
    this.addToWishlistSub?.unsubscribe();
  }
}
