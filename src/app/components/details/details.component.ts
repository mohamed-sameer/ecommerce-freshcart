import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { Subscription } from 'rxjs';
import { IProduct } from '../../core/interfaces/iproduct';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit, OnDestroy {
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _ProductsService = inject(ProductsService);

  // Initialize productDetails as an empty Object and as IProduct to fill all the properties from IProduct
  // productDetails: IProduct = {} as IProduct;
  // better option
  productDetails: IProduct | null = null;
  getSpecificProductSub!: Subscription;

  // owl options
  detailsCustomOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 5000,
    navText: ['', ''],
    items: 1,
    nav: false,
  };

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        let productId = params.get('productId');
        this.getSpecificProductSub = this._ProductsService
          .getSpecificProduct(productId)
          .subscribe({
            next: (product) => {
              this.productDetails = product.data;
            },
          });
      },
    });
  }

  ngOnDestroy(): void {
    this.getSpecificProductSub?.unsubscribe();
  }
}
