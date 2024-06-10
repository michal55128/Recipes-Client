import { Component, OnInit, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RecipeService } from '../../shared/services/recipe.service';
import { Recipe } from '../../shared/models/recipe';
import {MatIconModule} from '@angular/material/icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-allrecipes',
  standalone: true,
  imports: [CardModule, ButtonModule,MatIconModule],
  templateUrl: './allrecipes.component.html',
  styleUrl: './allrecipes.component.scss'
})
export class AllrecipesComponent implements OnInit{

  private recipeService = inject(RecipeService);
 recipes:Recipe[]=[];
 length:number=0;

  ngOnInit() {
    // this.spinner.show();
    this.recipeService.getAllRecipes().subscribe(data => {
      this.recipes = data
      this.length = data.length;
      // this.filteredRecipes = this.recipes.slice((this.pageIndex) * this.pageSize, (this.pageIndex + 1) * this.pageSize)
      // this.spinner.hide();
      // this.isLoading = false
    });
  }

  showFullRecipe(recipe: Recipe) {
    // כאן ניתן להוסיף את הלוגיקה להצגת המתכון המלא
    console.log('Showing full recipe:', recipe);
  }

  constructor(private sanitizer: DomSanitizer) {}

  getLevelIcons(level: number): SafeHtml {
    let icons = '';
    for (let i = 0; i < 5; i++) {
      icons += i < level ? '<i class="fas fa-circle"></i>' : '<i class=" far fa-circle"></i>';
    }
    return this.sanitizer.bypassSecurityTrustHtml(icons);
  }
  

 

}
