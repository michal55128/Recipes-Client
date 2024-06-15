import { Injectable, inject } from '@angular/core';
import { Category } from '../models/category';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  category: Category[] = [];
  private http = inject(HttpClient);
  private categoryURL = `${environment.apiURL}/categories`;

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoryURL);
  }
  getById(id: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.categoryURL}/${id}`);
  }
  getAllCategoriesWithRecipes(): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${this.categoryURL}/categoriesWithRecipes`
    );
  }

  constructor() {}
}
