import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { AllrecipesComponent } from './components/allrecipes/allrecipes.component';

export const routes: Routes = [
    {path:'login', component:LoginComponent},
    {path:'register', component:RegisterComponent},
    {path:'', component:HomeComponent},
    {path:'allrecipes', component:AllrecipesComponent},


];
