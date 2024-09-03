import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BrandsService } from '../../core/services/brands.service';
import { Subscription } from 'rxjs';
import { IBrand } from '../../core/interfaces/ibrand';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
})
export class BrandsComponent implements OnInit, OnDestroy {
  private readonly _BrandsService = inject(BrandsService);
  getAllBrandsSub!: Subscription;

  allBrands: IBrand[] | null = null;
  ngOnInit(): void {
    this.getAllBrandsSub = this._BrandsService.getAllBrands().subscribe({
      next: (res) => {
        this.allBrands = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  ngOnDestroy(): void {
    this.getAllBrandsSub?.unsubscribe();
  }
}
