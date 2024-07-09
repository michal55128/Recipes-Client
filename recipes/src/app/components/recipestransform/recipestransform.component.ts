import { Component, inject } from '@angular/core';
import { Recipe } from '../../shared/models/recipe';
import { RecipeService } from '../../shared/services/recipe.service';
import { UserService } from '../../shared/services/user.service';
import {  Router, RouterModule, RouterOutlet } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { log } from 'console';
import { LevelRepeatDirective } from '../../shared/directives/level-repeat.directive';
import { TimePreparationPipe } from '../../shared/pipes/time-preparation.pipe';

@Component({
  selector: 'app-recipestransform',
  standalone: true,
  imports: [ RouterOutlet,
    RouterModule,
    MatIconModule,
    LevelRepeatDirective  ,
    TimePreparationPipe,LevelRepeatDirective
  ],
  templateUrl: './recipestransform.component.html',
  styleUrl: './recipestransform.component.scss',
})
export class RecipestransformComponent {
  recipes: Recipe[] = [];
  position: number = 0;
  cardsToShow: number = 3;
  userService = inject(UserService);
  length: number = 0;
  cardWidth: number = 340;
  moveInterval: number = 5000; 
  moveSubscription!: Subscription;
  recipeService = inject(RecipeService);
  levels = Array.from({ length: 5 }, (_, i) => i + 1);

  constructor(    private router: Router,

    private sanitizer: DomSanitizer,

  ) {}

  viewRecipe(recipe: Recipe) {
    console.log('View Recipe:', recipe);
  }

  ngOnInit(): void {
    this.recipeService.getAllRecipes().subscribe((data) => {
      this.recipes = data;
      this.length = data.length;
    });
    this.moveSubscription = interval(this.moveInterval).subscribe(() => {
      this.moveRight();
    });
  }

  getLevelIcons(level: number): SafeHtml {
    let icons = '';
    for (let i = 0; i < 5; i++) {
      icons +=
        i < level
          ? '<i class="fas fa-circle filled"></i>'
          : '<i class="far fa-circle"></i>';
    }
    return this.sanitizer.bypassSecurityTrustHtml(icons);
  }

  recipeDetails(id: string) {
    if (this.userService.token) {
    this.router.navigate(['/recipe', id]);
    window.scrollTo(0, 0);

    }
  }

  moveLeft() {
    if (this.position < 0) {
      this.position += this.cardWidth;
      this.position = Math.min(this.position, 0);
    }
  }
  
  ngOnDestroy() {
    if (this.moveSubscription) {
      this.moveSubscription.unsubscribe();
    }
  }

  moveRight() {
    const totalWidth = this.recipes.length * this.cardWidth;
    const containerWidth = this.cardsToShow * this.cardWidth;
    if (totalWidth > containerWidth) {
      this.position -= this.cardWidth;
      this.position = Math.max(-(totalWidth - containerWidth), this.position);
    }
  }
  
}
