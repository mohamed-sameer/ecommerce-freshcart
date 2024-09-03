import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { IProduct } from '../../core/interfaces/iproduct';
import { Subscription } from 'rxjs';
import { CategoriesService } from '../../core/services/categories.service';
import { ICategory } from '../../core/interfaces/icategory';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { TermTextPipe } from '../../core/pips/term-text.pipe';
import { SearchPipPipe } from '../../core/pips/search-pip.pipe';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { ProductsComponent } from '../products/products.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CarouselModule,
    RouterLink,
    TermTextPipe,
    SearchPipPipe,
    FormsModule,
    ProductsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly _ProductsService = inject(ProductsService);
  private readonly _CategoryService = inject(CategoriesService);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  productsList: IProduct[] = [];
  categoriesList: ICategory[] = [];
  getAllProductSub!: Subscription;
  getAllCategoriesSub!: Subscription;
  addToCartSub!: Subscription;
  textSearch: string = '';

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
    // get all categories
    this.getAllCategoriesSub = this._CategoryService
      .getAllCategories()
      .subscribe({
        next: (res) => {
          this.categoriesList = res.data;
        },
      });

    this.getAllProductSub = this._ProductsService.getAllProducts().subscribe({
      next: (res) => {
        this.productsList = res.data;
      },
    });
  }

  addToCart(id: string): void {
    this.addToCartSub = this._CartService.addToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        this._ToastrService.success(res.message, 'FreshCart');
      },
    });
  }

  ngOnDestroy(): void {
    this.getAllProductSub?.unsubscribe();
    this.getAllCategoriesSub?.unsubscribe();
    this.addToCartSub?.unsubscribe();
  }
}
