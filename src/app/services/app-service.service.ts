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
  newPromoValue: string;

  promoValue: string = '';

  searchTerm: string = '';

  basket: Set<IPhoto> = new Set();

  photos: IPhoto[] = [];

  filteredByParamsPhotos: IPhoto[] = [];

  filteredByTitlePhotos: IPhoto[] = [];

  filteredPhotos: IPhoto[] = [];

  constructor() { }

  setPromoValue(value: string) {
    this.promoValue = value
  }

  addLoadedPhotos(photos: IPhoto[]): void {
    this.photos = this.photos.concat(photos);
  }

  addLoadedToFiltered(): void {
    this.filteredPhotos = this.photos;
    this.filteredByTitlePhotos = this.photos;
    this.filteredByParamsPhotos = this.photos;
  }

  addToBasket(photo: IPhoto): void {
    let keysArr = [...this.basket.keys()];
    if (keysArr.every(key => key.id !== photo.id)) {
      this.basket.add(photo)
    }
  }

  findById(id: number): IPhoto {
    return this.photos.find(photo => photo.id === id);
  }

  filterBasket(orders: IPhoto[]): void {
    this.clearBasket();
    orders.forEach(order => {
      this.basket.add(order)
    })
  }

  resetIsSelected(): void {
    this.photos.forEach(photo => photo.isSelected = false);
  }

  filteringPhotos(popularityFilterValue: number, priceFilterValue: number): void {
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

  setFilteredPhotos(): void {
    this.filteredPhotos = this.filteredByParamsPhotos;
  }

  getKeysOfBasket(): IPhoto[] {
    return [...this.basket.keys()];
  }

  clearBasket(): void {
    this.basket.clear();
  }
}
