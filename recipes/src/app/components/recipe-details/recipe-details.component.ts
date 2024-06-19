import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../shared/models/recipe';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../shared/services/recipe.service';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LoginComponent } from '../login/login.component';
import { RecipestransformComponent } from '../recipestransform/recipestransform.component';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [DatePipe,LoginComponent,RecipestransformComponent],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.scss',
})
export class RecipeDetailsComponent implements OnInit {
  recipe: any;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recipeService.getRecipeById(id).subscribe((recipe) => {
        this.recipe = recipe;
      });
    } else {
      console.error('Recipe ID is null');
    }
  }

  getLevelIcons(level: number): SafeHtml {
    let icons = '';
    for (let i = 0; i < 5; i++) {
      icons += i < level ? '<i class="fas fa-circle"></i>' : '<i class=" far fa-circle"></i>';
    }
    return this.sanitizer.bypassSecurityTrustHtml(icons);
  }
}
