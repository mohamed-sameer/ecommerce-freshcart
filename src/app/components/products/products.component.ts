import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '../../core/interfaces/iproduct';
import { Subscription } from 'rxjs';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchPipPipe } from '../../core/pips/search-pip.pipe';
import { TermTextPipe } from '../../core/pips/term-text.pipe';
import { IWishlist } from '../../core/interfaces/iwishlist';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink, FormsModule, SearchPipPipe, TermTextPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  private readonly _ProductsService = inject(ProductsService);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  productsList: IProduct[] = [];
  getAllProductSub!: Subscription;
  getAllCategoriesSub!: Subscription;
  addToCartSub!: Subscription;
  getWishlistSub!: Subscription;
  addToWishlistSub!: Subscription;

  textSearch: string = '';
  userWishlist: IWishlist[] = [];

  // owl carousel options
  CategoryCustomOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 6,
      },
    },
    nav: false,
  };

  mainCustomOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 3000,
    navText: ['', ''],
    items: 1,
    nav: false,
  };

  ngOnInit(): void {
    // console.log(this.userWishlist);
    this.getAllProductSub = this._ProductsService.getAllProducts().subscribe({
      next: (res) => {
        console.log(res);
        this.productsList = res.data;
      },
    });

    this.getWishlistSub = this._ProductsService.getWishlist().subscribe({
      next: (res) => {
        // console.log(res);
        if (res.status === 'success') {
          this.userWishlist = res.data;
        }
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
          this.userWishlist = res.data;
          this._ToastrService.success(res.message, 'FreshCart');
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.getAllProductSub?.unsubscribe();
    this.getAllCategoriesSub?.unsubscribe();
    this.addToCartSub?.unsubscribe();
    this.getWishlistSub?.unsubscribe();
    this.addToWishlistSub?.unsubscribe();
  }
}
