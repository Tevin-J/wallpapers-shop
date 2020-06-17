import { Injectable } from '@angular/core';

export interface IPhoto {
  title: string;
  description: string;
  id: number;
  url: string;
  price: number;
  isSelected: boolean;
  popularity: number;
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

  addLoadedPhotos(photos) {
    this.photos = this.photos.concat(photos);
  }

  addLoadedToFiltered() {
    this.filteredPhotos = this.photos;
    this.filteredByTitlePhotos = this.photos;
    this.filteredByParamsPhotos = this.photos;
  }

  addToBasketFromPopup(photo) {
    this.basket.add(photo);
  }

  findById(id) {
    return this.photos.find(photo => photo.id === id);
  }

  filterBasket(id) {
    this.basket.forEach((value, value2, set) => {
      if (value.id === id) {
        set.delete(value);
      }
    })
  }

  addSelectedToBasket(photo) {
    this.basket.add(photo);
  }

  resetIsSelected() {
    this.photos.forEach(photo => photo.isSelected = false);
  }

  filteringPhotos(popularityFilterValue, priceFilterValue) {
    this.filteredByParamsPhotos = this.filteredByTitlePhotos.filter(photo => {
      if (popularityFilterValue) {
        if (photo.price <= priceFilterValue && photo.popularity === popularityFilterValue) {
          return photo;
        }
      } else {
        return photo.price <= priceFilterValue;
      }
    });
  }

  setFilteredPhotos() {
    this.filteredPhotos = this.filteredByParamsPhotos;
  }

  clearBasket() {
    this.basket.clear();
  }
}
