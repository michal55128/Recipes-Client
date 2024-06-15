import { Component, OnInit, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RecipeService } from '../../shared/services/recipe.service';
import { Recipe } from '../../shared/models/recipe';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Category } from '../../shared/models/category';
import { CategoryService } from '../../shared/services/category.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-allrecipes',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    RouterOutlet,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  templateUrl: './allrecipes.component.html',
  styleUrl: './allrecipes.component.scss',
})
export class AllrecipesComponent implements OnInit {
  private recipeService = inject(RecipeService);
  private userService = inject(UserService);
  private categoryService = inject(CategoryService);

  recipes: Recipe[] = [];
  length: number = 0;
  showdialog = false;
  categories: Category[] = [];
  selectedCategories: string[] = [];
  searchText: string = '';
  page: number = 1;
  perPage: number = 10;
  totalPages: number = 10;
  maxtime?:number=15;
  ngOnInit() {
    this.onSelectionChange();
    this.loadAllRecipes();
    this.loadCategories();
    console.log(this.recipes);
  }
  onSelectionChange() {
    if (!this.selectedCategories.length) {
      this.loadAllRecipes();
      return;
    }
    this.recipes=[];
    this.selectedCategories.forEach((categoryId) => {
      this.categoryService.getById(categoryId).subscribe(
        (data: Recipe[]) => {
          this.recipes.push(...data);
          console.log(this.recipes);
          console.log(data);
        },
        (error) => {
          console.error(
            `Failed to load recipes for category ${categoryId}:`,
            error
          );
        }
      );
    });
  }
  private loadAllRecipes() :Recipe[] {
    this.recipes=[];
    this.recipeService
      .getAllRecipes(this.searchText, this.page, this.perPage)
      .subscribe(
        (data: Recipe[]) => {
          this.recipes = data;
          this.updateFilteredRecipes();
        },
        (error) => {
          console.error('Failed to load recipes:', error);
        }
      );
      return this.recipes;
  }
  filteredRecipes: Recipe[] = [];

  private updateFilteredRecipes() {
    const start = (this.page - 1) * this.perPage;
    const end = start + this.perPage;
    this.filteredRecipes = this.recipes.slice(start, end);
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
      (error) => {
        console.error('Failed to load categories:', error);
      }
    );
  }
  searchRecipes() {
    this.totalPages = this.page;
    this.page = 1;
    this.loadAllRecipes();
  }

  getCategoryDescription(categoryId: string): string {
    const category = this.categories.find((c) => c._id === categoryId);
    return category ? category.description : '';
  }

  showFullRecipe(recipe: Recipe) {
    console.log('Showing full recipe:', recipe);
  }

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private dialog: MatDialog
  ) {}

  getLevelIcons(level: number): SafeHtml {
    let icons = '';
    for (let i = 0; i < 5; i++) {
      icons +=
        i < level
          ? '<i class="fas fa-circle"></i>'
          : '<i class=" far fa-circle"></i>';
    }
    return this.sanitizer.bypassSecurityTrustHtml(icons);
  }
  viewRecipeDetails(id: string) {
    if (this.userService.token) {
      this.router.navigate(['/recipe', id]);
    } else {
      this.showdialog = true;
    }
  }

  closeDialog() {
    this.showdialog = false;
  }
  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadAllRecipes();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadAllRecipes();
    }
  }

  goToPage(pageNum: number): void {
    this.page = pageNum;
    this.loadAllRecipes();
  }

  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
