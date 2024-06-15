import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Recipe } from '../models/recipe';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor() {}
  private http = inject(HttpClient);
  private recipeURL = `${environment.apiURL}/recipes`;

  recipes: Recipe[] = [];

  getAllRecipes(
    search: string = '',
    page: number = 0,
    perPage: number = 0
  ): Observable<Recipe[]> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('perPage', perPage.toString());
    return this.http.get<Recipe[]>(this.recipeURL, { params });
  }


  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.recipeURL}/${id}`);
  }
  getRecipesByTime(time: number): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.recipeURL}/getByTime/${time}`);
  }
  getRecipesByUsertime(userid: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.recipeURL}/userId/${userid}`);
  }

}
