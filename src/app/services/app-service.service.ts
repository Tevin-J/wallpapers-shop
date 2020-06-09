import { Injectable } from '@angular/core';

export interface IPhoto {
  description: string;
  id: number;
  liked_by_user: boolean;
  urls: {
    full: string;
    small: string;
  };
  price: number;
}
@Injectable({
  providedIn: 'root'
})
export class AppService {

  searchTerm = '';

  basket = [];

  photos: Array<IPhoto> = [];

  constructor() { }
}
