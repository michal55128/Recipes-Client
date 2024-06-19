import { User } from './user';

interface layersSchema {
  description: string;
  components: [string];
}

export interface Recipe {
  _id: string;
  name: string;
  description: string;
  nameCategory: string;
  preparationTimeInMinute: number;
  level: number;
  addDate: Date;
  layers: [layersSchema];
  Preparation: [string];
  // imageName: string;
  // imageUrl: string;
    image: string;
  isPrivate: boolean;
  user: User;
}
