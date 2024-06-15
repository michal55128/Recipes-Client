import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { AllrecipesComponent } from './components/allrecipes/allrecipes.component';
import { RecipeDetailsComponent } from './components/recipe-details/recipe-details.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { authGuard } from './shared/guards/auth.guard';
import { isAdminGuard } from './shared/guards/is-admin.guard';

export const routes: Routes = [
    {path: '', loadComponent: () => import('./components/home/home.component').then(c => c.HomeComponent), pathMatch: 'full' },
    {path:'login',loadComponent:()=>import('./components/login/login.component').then(c=>c.LoginComponent) ,pathMatch:'full'},
    {path:'register', loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent) },
    {path:'allrecipes',  loadComponent: () => import('./components/allrecipes/allrecipes.component').then(c => c.AllrecipesComponent)},
    { path: 'recipe/:id',canActivate: [authGuard], loadComponent: () => import('./components/recipe-details/recipe-details.component').then(c => c.RecipeDetailsComponent) },
    { path: 'allusere',canActivate: [isAdminGuard], loadComponent: () => import('./components/all-users/all-users.component').then(c => c.AllUsersComponent)},
    
];
