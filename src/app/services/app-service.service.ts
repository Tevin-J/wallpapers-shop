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

  promoValue = '';

  searchTerm = '';

  basket: Set<IPhoto> = new Set();

  photos: Array<IPhoto> = [];

  filteredByParamsPhotos: Array<IPhoto> = [];

  filteredByTitlePhotos: Array<IPhoto> = [];

  filteredPhotos: Array<IPhoto> = [];

  constructor() { }

  setPromoValue(value) {
    this.promoValue = value
  }

  addLoadedPhotos(photos) {
    this.photos = this.photos.concat(photos);
  }

  addLoadedToFiltered() {
    this.filteredPhotos = this.photos;
    this.filteredByTitlePhotos = this.photos;
    this.filteredByParamsPhotos = this.photos;
  }

  addToBasket(photo) {
    let keysArr = [...this.basket.keys()];
    if (keysArr.every(key => key.id !== photo.id)) {
      this.basket.add(photo)
    }
  }

  findById(id) {
    return this.photos.find(photo => photo.id === id);
  }

  filterBasket(orders) {
    this.clearBasket();
    orders.forEach(order => {
      this.basket.add(order)
    })
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

  getKeysOfBasket() {
    return [...this.basket.keys()];
  }

  clearBasket() {
    this.basket.clear();
  }
}
