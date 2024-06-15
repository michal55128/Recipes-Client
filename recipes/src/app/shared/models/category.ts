import { Recipe } from './recipe';

export interface Category {
  _id: string;
  description: string;
  recipes: [Recipe];
}

