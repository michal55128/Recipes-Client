import { Component, OnInit, inject } from '@angular/core';
import { RecipeService } from '../../shared/services/recipe.service';
import { UserService } from '../../shared/services/user.service';
import { Recipe } from '../../shared/models/recipe';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LevelRepeatDirective } from '../../shared/directives/level-repeat.directive';
import { TimePreparationPipe } from '../../shared/pipes/time-preparation.pipe';
import { User } from '../../shared/models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-myrecipes',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    LevelRepeatDirective,
    TimePreparationPipe,
    LevelRepeatDirective,
    MatDialogModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './myrecipes.component.html',
  styleUrl: './myrecipes.component.scss',
})
export class MyrecipesComponent implements OnInit {
  recipeService = inject(RecipeService);
  userService = inject(UserService);
  router = inject(Router);
  recipes: Recipe[] = [];
  levels = Array.from({ length: 5 }, (_, i) => i + 1);
  showdialog: boolean = false;
  ngOnInit(): void {
    this.getMyRecipes();
  }
  constructor(private snackBar: MatSnackBar) {}
  getMyRecipes() {
    let currntUser: User | null = this.userService.getCurrentUser();
    console.log(currntUser);

    if (currntUser) {
      let user = {
        userId: currntUser?._id,
        name: currntUser?.username,
      };
      console.log(currntUser?._id);
      this.recipeService
        .getRecipesByUserName(currntUser?._id || ' ')
        .subscribe((data) => {
          this.recipes = data;
          console.log(data);
        });
      console.log('User:', user);
    }
  }
  recipeDetails(id: string) {
    if (this.userService.token) {
      this.router.navigate(['/recipe', id]);
      window.scrollTo(0, 0);
    } else {
      this.openSnackBar('Token expired. Please login again.');
      this.router.navigate(['/login']);
    }
  }

  editRecipe(id: string) {}
  currntRecipe: string = '';
  deleteRecipe(id: string) {
    this.showdialog = true;
    this.currntRecipe = id;
    // alert(id);
  }
  confirmDelete() {
    this.showdialog=false;
    if (!this.userService.token) {
      this.openSnackBar('Token expired. Please login again.');

      this.router.navigate(['/login']);
      return;
    }
    this.recipeService.deleteRecipe(this.currntRecipe).subscribe(
      () => {
        console.log('Recipe deleted successfully');
        // alert('the recipe delete');
        this.openSnackBar('The recipe was deleted successfully');
        this.getMyRecipes();
      },
      (error) => console.error('Error deleting recipe', error)
    );
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-style'],
    });
  }

  closeDialog() {
    this.showdialog = false;
  }
}
