import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Category } from '../../shared/models/category';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ValidationErrors, ValidatorFn } from '@angular/forms';
import { RecipeService } from '../../shared/services/recipe.service';
import { CategoryService } from '../../shared/services/category.service';
import { UserService } from '../../shared/services/user.service';

export const nonEmptyLayersValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const formArray = control as FormArray;
  for (let i = 0; i < formArray.length; i++) {
    const formGroup = formArray.at(i) as FormGroup;
    const description = formGroup.get('description')?.value;
    const ingredients = formGroup.get('ingredients') as FormArray;

    if (
      !description ||
      ingredients.length === 0 ||
      ingredients.controls.some((control) => !control.value)
    ) {
      return { nonEmptyIngredients: true };
    }
  }
  return null;
};

export const nonEmptyPreparationInstructionsValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const formArray = control as FormArray;
  const hasNonEmptyInstruction = formArray.controls.some(
    (group) => group.get('step')?.value.trim() !== ''
  );
  return hasNonEmptyInstruction
    ? null
    : { nonEmptyPreparationInstructions: true };
};
@Component({
  selector: 'app-formrecipe',
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
  ],
  templateUrl: './formrecipe.component.html',
  styleUrl: './formrecipe.component.scss',
})
export class FormrecipeComponent implements OnInit {
  recipeForm!: FormGroup;
  categoryList: Category[] = [];
  showNewCategoryInput = false;
  isNewCategoryChecked = false;
  newCategoryName = '';
  recipeId: string = '';
  isUpdateMode: boolean = false;
  selectedFile: File | null = null;
  selectedImage: string | ArrayBuffer | null = null;
  levels: number[] = [1, 2, 3, 4, 5];
  nameCategorySelected = '';
  newCategory = false;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    // private authService: AuthService
    private userService: UserService
  ) {
    categoryService
      .getAllCategories()
      .subscribe((x) => (this.categoryList = x));

    this.recipeForm = fb.group({
      name: fb.control(
        '',
        Validators.pattern(
          /^(?=(?:[^a-zA-Z\u0590-\u05FF]*[a-zA-Z\u0590-\u05FF]){2})/
        )
      ),
      description: fb.control(
        '',
        Validators.pattern(/^(?=(?:[^a-zA-Z]*[a-zA-Z]){2})/)
      ),
      level: fb.control('', [
        Validators.required,
        Validators.min(1),
        Validators.max(5),
      ]),
      preparationTimeInMinute: fb.control('', [Validators.required, Validators.min(1)]),
      isPrivate: fb.control(false),
      image: fb.control('', [
        Validators.required,
        Validators.pattern(/.*\.(jpg|jpeg|png)$/),
      ]),
      nameCategory: fb.control(
        '',
        Validators.pattern(
          /^(?=(?:[^a-zA-Z\u0590-\u05FF]*[a-zA-Z\u0590-\u05FF]){2})/
        )
      ),
      ingredients: fb.array([this.createIngredient(), Validators.minLength(1)]),
      layers: fb.array([this.createLayer()], nonEmptyLayersValidator),
      preparationInstructions: fb.array(
        [this.createInstruction()],
        nonEmptyPreparationInstructionsValidator
      ),
    });
    this.recipeId = this.route.snapshot.paramMap.get('id') || '';
    if (this.recipeId) {
      this.isUpdateMode = true;
      // this.loadRecipeData();
      console.log(this.recipeId);
    }
  }

  ngOnInit() {
    this.initializeForm();
    // debugger
    this.categoryService
      .getAllCategories()
      .subscribe((categories) => (this.categoryList = categories));
    console.log(this.categoryList);

    const recipeId = this.route.snapshot.paramMap.get('id');
    if (recipeId) {
      this.isUpdateMode = true;
    }
  }

  getCategoryDescription(nameCategory: string): string {
    return (this.nameCategorySelected = nameCategory);
  }
  initializeForm() {
    this.recipeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(2)]],
      level: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      preparationHours: [0, Validators.min(0)],
      preparationTimeInMinute: [0, Validators.min(0)],
      isPrivate: false,
      image: [
        '',
        [Validators.required, Validators.pattern(/.*\.(jpg|jpeg|png)$/)],
      ],
      layers: this.fb.array(
        [
          this.fb.group({
            description: ['', Validators.required], // String type description field
            components: this.fb.array([]), // Empty array of components initially
          }),
        ],
        this.nonEmptyLayersValidator
      ),

      Preparation: this.fb.array(
        [this.createInstruction()],
        this.nonEmptyPreparationInstructionsValidator
      ),
    });
  }

  nonEmptyLayersValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const formArray = control as FormArray;
    for (let i = 0; i < formArray.length; i++) {
      const formGroup = formArray.at(i) as FormGroup;
      const description = formGroup.get('description')?.value;
      const ingredients = formGroup.get('components') as FormArray;

      if (
        !description ||
        ingredients.length === 0 ||
        ingredients.controls.some((control) => !control.value)
      ) {
        return { nonEmptyIngredients: true };
      }
    }
    return null;
  };

  nonEmptyPreparationInstructionsValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const formArray = control as FormArray;
    const hasNonEmptyInstruction = formArray.controls.some(
      (group) => group.get('step')?.value.trim() !== ''
    );
    return hasNonEmptyInstruction
      ? null
      : { nonEmptyPreparationInstructions: true };
  };

  // loadRecipeData() {
  //   this.recipeService.getRecipeById(this.recipeId).subscribe(recipe => {
  //     this.recipeForm.patchValue({
  //       name: recipe?.name,
  //       description: recipe?.description,
  //       difficulity: recipe?.level,
  //       preparationTime: recipe?.preparationTimeInMinute,
  //       preparationHours: Math.floor(recipe?.preparationTimeInMinute ? recipe.preparationTimeInMinute / 60 : 0),
  //       preparationMinutes: recipe?.preparationTimeInMinute ? recipe.preparationTimeInMinute % 60 : 0,
  //       isPrivate: recipe.isPrivate ? 'yes' : 'no',
  //       imageName: recipe?.imageName,
  //       imageUrl: recipe?.imageUrl,
  //       nameCategory: recipe?.nameCategory
  //     });
  //     this.selectedImage = recipe.imageUrl;
  //     const layersArray = this.recipeForm.get('layers') as FormArray;
  //     layersArray.removeAt(0);
  //     if (recipe.layers) {
  //       recipe.layers.forEach(layer => {
  //         const layerGroup = this.fb.group({
  //           description: layer.description,
  //           components: this.fb.array([])
  //         });
  //         const ingredientsArray = layerGroup.get('components') as FormArray;
  //         if (layer.components) {
  //           layer.components.forEach(comp => {
  //             ingredientsArray.push(this.fb.group({ name: comp }));
  //           });
  //           ingredientsArray.push(this.createIngredient())

  //         }
  //         layersArray.push(layerGroup);
  //       });
  //     }
  //     const preparationInstructions = this.recipeForm.get('preparationInstructions') as FormArray;
  //     preparationInstructions.removeAt(0);
  //     if (recipe.Preparation) {
  //       recipe.Preparation.forEach(instruction => {
  //         preparationInstructions.push(this.fb.group({ step: instruction }));
  //       });
  //       preparationInstructions.push(this.createInstruction());
  //     }
  //   });
  // }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
        this.recipeForm.patchValue({ image: this.selectedFile?.name });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // updateCategories(selectedCategories: string[]): void {
  //   const categoriesArray = this.recipeForm.get('categories') as FormArray;
  //   categoriesArray.clear();
  //   selectedCategories.forEach(category => categoriesArray.push(this.fb.control(category)));
  // }

  // onCategoryChange(event: MatSelectChange) {
  //   if (event.value.includes('other')) {
  //     this.showNewCategoryInput = true;
  //   } else {
  //     this.showNewCategoryInput = false;
  //   }
  // }

  // addNewCategory() {
  //   const newC = this.newCategories;
  //   let currentCategories = this.recipeForm.get('categories')?.value || [];

  //   currentCategories.push(this.newCategoryName);
  //   this.recipeForm.get('categories')?.setValue(currentCategories);
  //   this.showNewCategoryInput = false;
  //   const otherIndex = currentCategories.indexOf('other');
  //   if (otherIndex > -1) {
  //     currentCategories.splice(otherIndex, 1);
  //   }
  //   currentCategories.pop();
  //   this.recipeForm.get('categories')?.setValue(currentCategories);
  // }
  addNewCategory() {
    const newCategoriesControl = this.recipeForm.get(
      'newCategories'
    ) as FormArray;
    newCategoriesControl.push(this.fb.control(this.newCategoryName));
    this.showNewCategoryInput = false;
    this.recipeForm
      .get('categories')
      ?.setValue([
        ...this.recipeForm.get('categories')?.value,
        this.newCategoryName,
      ]);
  }

  get instructions(): FormArray {
    return this.recipeForm.get('preparationInstructions') as FormArray;
  }

  get layers(): FormArray {
    return this.recipeForm.get('layers') as FormArray;
  }
  get newCategories(): FormArray {
    return this.recipeForm.get('newCategories') as FormArray;
  }

  getIngredientsArray(layer: AbstractControl): FormArray {
    return layer.get('components') as FormArray;
  }

  getIngredients(layer: AbstractControl): FormArray {
    return layer.get('components') as FormArray;
  }

  createIngredient(): FormGroup {
    return this.fb.group({
      name: '',
    });
  }

  // createLayer(): FormGroup {
  //   return this.fb.group({
  //     description: ['', Validators.required],
  //     components: this.fb.array([this.createIngredient()])
  //   })
  // }

  createInstruction(): FormGroup {
    return this.fb.group({
      step: '',
    });
  }

  createCategory(): FormGroup {
    return this.fb.group({
      name: '',
    });
  }

  addLayer() {
    this.layers.push(this.createLayer());
  }

  removeLayer(index: number) {
    this.layers.removeAt(index);
  }
  // addRecipe() {
  //   if (this.recipeForm.invalid) {
  //     return;
  //   }

  //   const recipe = this.recipeForm.value;
  //   console.log('Recipe Details:', recipe);

  //   if (this.selectedFile) {
  //     const formData = new FormData();
  //     formData.append('image', this.selectedFile);
  //     formData.append('recipe', JSON.stringify(recipe));
  //     this.recipeService.addRecipe(formData).subscribe(response => {
  //       console.log('Response:', response);
  //     });
  //   } else {
  //     this.recipeService.addRecipe(recipe).subscribe(response => {
  //       console.log('Response:', response);
  //     });
  //   }
  // }

  onIngredientInput(layerIndex: number, ingredientIndex: number) {
    const layersArray = this.layers.at(layerIndex).get('') as FormArray;
    const control = layersArray.at(ingredientIndex);
    if (control.value.name && ingredientIndex === layersArray.length - 1) {
      layersArray.push(this.createIngredient());
    } else if (
      !control.value.name &&
      ingredientIndex !== layersArray.length - 1
    ) {
      layersArray.removeAt(ingredientIndex);
    }
  }
  onInstructionInput(index: number) {
    const control = this.instructions.at(index);
    if (control.value.step && index === this.instructions.length - 1) {
      this.instructions.push(this.createInstruction());
    } else if (!control.value.step && index !== this.instructions.length - 1) {
      this.instructions.removeAt(index);
    }
  }

  onCategoriesInput(index: number) {
    const control = this.newCategories.at(index);
    if (control.value && index === this.newCategories.length - 1) {
      this.newCategories.push(this.createCategory());
    } else if (!control.value.name && index !== this.newCategories.length - 1) {
      this.newCategories.removeAt(index);
    }
  }

  addRecipe() {
    if (!this.isUpdateMode) {
      let recipe = this.recipeForm.value;
      // const user = { _id: this.authService.currentUser?._id, name: this.authService.currentUser?.username }
      // recipe.user = user;
      console.log(recipe);

      if (this.selectedFile) {

        const formData = new FormData();
        formData.append('image', this.selectedFile);
        formData.append('recipe', JSON.stringify(recipe));
        // this.recipeService.addRecipe(formData);
      }
    }
  }

  // addRecipe(): void {
  //   if (!this.isUpdateMode) {
  //     let recipe = this.recipeForm.value;
  //     console.log(recipe);

  //     if (this.selectedFile) {
  //       const formData = new FormData();
  //       formData.append('image', this.selectedFile);
  //       formData.append('recipe', JSON.stringify(recipe));
  //       this.recipeService.addRecipe(formData).subscribe(
  //         response => {
  //           console.log('Recipe added successfully:', response);
  //           // Handle success as needed
  //         },
  //         error => {
  //           console.error('Error adding recipe:', error);
  //           // Handle error as needed
  //         }
  //       );
  //     }
  //   }
  // }

  // createComponent(): FormGroup {
  //   return this.fb.group({
  //     name: ''
  //   });
  // }

  // addComponent(layerIndex: number): void {
  //   const layer = this.layers.at(layerIndex).get('components') as FormArray;
  //   layer.push(this.createComponent());
  // }

  removeComponent(layerIndex: number, componentIndex: number): void {
    const layer = this.layers.at(layerIndex).get('components') as FormArray;
    layer.removeAt(componentIndex);
  }

  getComponents(layer: AbstractControl): FormArray {
    return layer.get('components') as FormArray;
  }

  createLayer(): FormGroup {
    return this.fb.group({
      components: this.fb.array([this.createComponent()]),
    });
  }

  createComponent(): FormGroup {
    return this.fb.group({
      name: '',
    });
  }

  addComponent(layerIndex: number): void {
    const layer = this.getLayers()
      .at(layerIndex)
      .get('components') as FormArray;
    layer.push(this.createComponent());
  }

  getLayers(): FormArray {
    return this.recipeForm.get('layers') as FormArray;
  }

  getLastLayer(): FormGroup {
    const layers = this.getLayers();
    return layers.at(layers.length - 1) as FormGroup;
  }

  getLastComponent(): FormGroup {
    const lastLayer = this.getLastLayer();
    const components = lastLayer.get('components') as FormArray;
    return components.at(components.length - 1) as FormGroup;
  }
}
