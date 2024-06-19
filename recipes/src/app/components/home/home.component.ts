import { Component, OnInit, inject } from '@angular/core';
import { RecipeService } from '../../shared/services/recipe.service';
import { Recipe } from '../../shared/models/recipe';
import { UserService } from '../../shared/services/user.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ MatDialogModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    RouterOutlet,
    RouterModule,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  recipes:Recipe[]=[];
  userService=inject(UserService);
  router=inject(Router);
length:number=0;
showdialog = false;

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

  recipeDetails(id:string) {
    if (this.userService.token) {
      this.router.navigate(['/recipe', id]);
    } else {
      this.showdialog = true;
    }
  }

  closeDialog() {
    this.showdialog = false;
  }
}
