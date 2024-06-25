import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { RecipeService } from '../../shared/services/recipe.service';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user';
import { Category } from '../../shared/models/category';
import { CategoryService } from '../../shared/services/category.service';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatDatepickerModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    RouterOutlet,
    RouterModule,
  ],
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.scss',
})
export class RecipeFormComponent implements OnInit {
  recipeForm: FormGroup;
  userService = inject(UserService);
  categoryService = inject(CategoryService);
  newCategory: boolean = false;
  levels: number[] = [1, 2, 3, 4, 5];
  showdialog = false;
  router = inject(Router);
  categoryList: Category[] = [];

  constructor(private fb: FormBuilder, private recipeService: RecipeService) {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      nameCategory: ['', Validators.required],
      preparationTimeInMinute: [null, [Validators.required, Validators.min(1)]],
      level: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      addDate: new Date(),
      layers: this.fb.array([this.createLayer()]),
      Preparation: this.fb.array([this.createPreparationStep()]),
      image: [''],
      isPrivate: [false],
      user: this.fb.group({
        name: ['', Validators.required],
        userId: ['', Validators.required],
      }),
    });

    this.categoryService
      .getAllCategories()
      .subscribe((x) => (this.categoryList = x));
  }

  ngOnInit(): void {
    console.log('valid', this.recipeForm.valid);
  }

  createLayer(): FormGroup {
    return this.fb.group({
      description: [''],
      components: this.fb.array([this.createComponent()]),
    });
  }

  createComponent(): FormGroup {
    return this.fb.group({
      component: [''],
    });
  }

  createPreparationStep(): FormGroup {
    return this.fb.group({
      step: [''],
    });
  }

  get layers(): FormArray {
    return this.recipeForm.get('layers') as FormArray;
  }

  get preparation(): FormArray {
    return this.recipeForm.get('Preparation') as FormArray;
  }

  addLayer(): void {
    this.layers.push(this.createLayer());
  }

  removeLayer(index: number): void {
    this.layers.removeAt(index);
  }

  addComponent(layerIndex: number): void {
    const components = this.layers
      .at(layerIndex)
      .get('components') as FormArray;
    components.push(this.createComponent());
  }

  removeComponent(layerIndex: number, componentIndex: number): void {
    const components = this.layers
      .at(layerIndex)
      .get('components') as FormArray;
    components.removeAt(componentIndex);
  }

  addPreparationStep(): void {
    this.preparation.push(this.createPreparationStep());
  }

  removePreparationStep(index: number): void {
    this.preparation.removeAt(index);
  }

  onComponentInput(layerIndex: number, componentIndex: number): void {
    const components = this.layers
      .at(layerIndex)
      .get('components') as FormArray;
    console.log(components.value[componentIndex].component);
    console.log(layerIndex);
    console.log(componentIndex);

    if (componentIndex === components.length - 1) {
      this.addComponent(layerIndex);
    }

    // if (components.at(componentIndex).value.component[components.length-1] === '')
    if (this.layers.at(componentIndex).value.component === '') {
      // if (components.at(componentIndex).value.component[componentIndex]=== ''){
      components.removeAt(componentIndex);
    }

    //  else if (componentIndex === components.length - 1) {
    //   this.addComponent(layerIndex);

    // }
  }

  onPreparationInput(stepIndex: number): void {
    console.log(this.preparation.at(stepIndex).value.step);

    if (this.preparation.at(stepIndex).value.step === '') {
      this.preparation.removeAt(stepIndex);
    } else if (stepIndex === this.preparation.length - 1) {
      this.addPreparationStep();
    }
  }

  convertComponentsToStrings(layers: any[]) {
    return layers.map((layer: any) => ({
      ...layer,
      components: layer.components.map(
        (component: any) => component.name || 'Unknown Component'
      ),
    }));
  }
  convertPreparationToStrings(preparation: any[]): string[] {
    return preparation
      .map((step: any) => step.step)
      .filter((step: string) => step !== '');
  }
  onSubmit(): void {
    console.log(this.recipeForm.value);
    let recipe = this.recipeForm.value;

    let layers = this.recipeForm.get('layers')?.value || [];
    layers = this.convertComponentsToStrings(layers);

    let preparation = this.recipeForm.get('Preparation')?.value || [];
    preparation = this.convertPreparationToStrings(preparation);
    let currntUser: User | null = this.userService.getCurrentUser();
    console.log(currntUser);

    if (currntUser) {
      let user = {
        userId: currntUser?._id,
        name: currntUser?.username,
      };

      recipe.user = user;
      console.log('User:', user);
    }
    this.recipeForm.get('level')?.value;
    const selectedLevel = this.recipeForm.get('level')?.value;
    console.log(selectedLevel);
    recipe.level = selectedLevel;
    recipe.layers = layers;

    recipe.Preparation = preparation;

    console.log(recipe);

    this.recipeService.addRecipe(recipe);
    this.showdialog=true;
  }

  getFormArray(control: AbstractControl | null): FormArray {
    return control as FormArray;
  }
  isValidForm(): boolean {
    return this.recipeForm.valid;
  }
  closeDialog() {
    this.showdialog = false;
    this.router.navigate(['/']);

    //לוהיסף ניתוב לכל המתוכנים
  }
  newCategoryAdd(){
    this.newCategory = !this.newCategory;
  }
}
