import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../shared/models/recipe';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../shared/services/recipe.service';
import { CommonModule, DatePipe } from '@angular/common';
import {
  BrowserModule,
  DomSanitizer,
  SafeHtml,
} from '@angular/platform-browser';
import { LoginComponent } from '../login/login.component';
import { RecipestransformComponent } from '../recipestransform/recipestransform.component';
import { TimePreparationPipe } from '../../shared/pipes/time-preparation.pipe';
import { LevelRepeatDirective } from '../../shared/directives/level-repeat.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [
    DatePipe,
    MatIconModule,
    CommonModule,
    LoginComponent,
    RecipestransformComponent,
    TimePreparationPipe,
    LevelRepeatDirective,
  ],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.scss',
})
export class RecipeDetailsComponent implements OnInit {
  recipe: any;
  levels = Array.from({ length: 5 }, (_, i) => i + 1);
  copyMessage: string | null = null;
  recipeId?: string;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private sanitizer: DomSanitizer
  ) {}

  // ngOnInit(): void {
  //   const id = this.route.snapshot.paramMap.get('id');
  //   if (id) {
  //     this.recipeService.getRecipeById(id).subscribe((recipe) => {
  //       this.recipe = recipe;
  //     });
  //   } else {
  //     console.error('Recipe ID is null');
  //   }
  // }



  ngOnInit() {
    this.route.params.subscribe(params => {
     this.recipeId  = params['id'];
     if (this.recipeId) {
      this.recipeService.getRecipeById(this.recipeId).subscribe((recipe) => {
        this.recipe = recipe;
      });
    } else {
      console.error('Recipe ID is null');
    }
      this.loadRecipeDetails();
    });
  }
  loadRecipeDetails() {
    console.log("Loading details for recipe ID: " + this.recipeId);
  }

  copyToClipboard() {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        this.copyMessage = 'Link copied!';
        setTimeout(() => {
          this.copyMessage = null;
        }, 2000);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  }
}
