import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Recipe } from '../models/recipe';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor() {}
  private http = inject(HttpClient);
  private recipeURL = `${environment.apiURL}/recipes`;
  userService=inject(UserService);
  recipes: Recipe[] = [];
  router=inject(Router);

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
  // addRecipe(r: Recipe) {
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${this.userService.token}`);
  //   console.log("Attempting to add recipe:", r);
  //   return this.http.post<Recipe>(
  //     `${this.recipeURL}/addRecipe`,
  //     r,
  //     { headers }
  //   ).subscribe(response => {
  //     // this._snackBar .open('המתכון נוסף בהצלחה!', 'סגור', { verticalPosition: 'top', duration: 4000 });
  //     this.router.navigateByUrl('allrecipes');
  //     console.log("Server response:", response);
  //   }, error => {
  //     // this._snackBar.open('אופס המתכון לא נוסף נסה שנית', 'סגור', { verticalPosition: 'top', });
  //     console.error("Error occurred:", error);
  //   });
  // }

  addRecipe(formData: FormData): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.userService.token}`);
    return this.http.post<any>(
      `${this.recipeURL}/addRecipe`,
      formData,
      { headers }
    );
  }
}
