import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { ICategory } from '../../core/interfaces/icategory';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private readonly _CategoriesService = inject(CategoriesService);

  getAllCategoriesSub!: Subscription;
  allCategories: ICategory[] | null = null;

  ngOnInit(): void {
    this.getAllCategoriesSub = this._CategoriesService
      .getAllCategories()
      .subscribe({
        next: (res) => {
          // console.log(res.data);
          this.allCategories = res.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  ngOnDestroy(): void {
    this.getAllCategoriesSub.unsubscribe();
  }
}
