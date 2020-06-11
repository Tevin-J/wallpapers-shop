import { Injectable } from '@angular/core';

export interface IPhoto {
  alt_description: string;
  id: number;
  urls: {
    full: string;
    small: string;
  };
  price: number;
  isSelected: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class AppService {

  searchTerm = '';

  basket: Set<IPhoto> = new Set();

  photos: Array<IPhoto> = [];

  filteredByParamsPhotos: Array<IPhoto> = [];

  filteredByTitlePhotos: Array<IPhoto> = [];

  filteredPhotos: Array<IPhoto> = [];

  constructor() { }

  clearBasket() {
    this.basket.clear();
  }
}
