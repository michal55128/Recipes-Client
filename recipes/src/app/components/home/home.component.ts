import { Component, OnInit, inject } from '@angular/core';
import { RecipeService } from '../../shared/services/recipe.service';
import { Recipe } from '../../shared/models/recipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  recipes:Recipe[]=[];

length:number=0;
  constructor() { }
recipeService=inject(RecipeService);

  ngOnInit(): void {
    this.recipeService.getAllRecipes().subscribe(data => {
      this.recipes = data
      this.length = data.length;
    
    });
  }

  viewRecipeDetails(recipe: any) {
    // Navigate to the recipe details page
    console.log('Viewing recipe details:', recipe.name);
  }
}
