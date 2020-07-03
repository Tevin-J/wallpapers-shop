import { Injectable } from '@angular/core';

export interface IPhoto {
  description: string | null;
  id: string;
  urlRegular: string;
  urlSmall: string;
  price: number;
  isSelected: boolean;
}

export interface IOrder {
  cost: number;
  items: IItem[];
}

export interface IItem {
  id: string;
  url: string;
}
@Injectable({
  providedIn: 'root'
})
export class AppService {
  newPromoValue: string;

  promoValue = '';

  searchTerm = '';

  basket: Set<IPhoto> = new Set();

  photos: IPhoto[] = [];

  filteredByParamsPhotos: IPhoto[] = [];

  filteredByTitlePhotos: IPhoto[] = [];

  filteredPhotos: IPhoto[] = [];

  basicScrollMode = null as boolean;

  byTitleScrollMode = null as boolean;

  byParamsScrollMode = null as boolean;

  constructor() { }

  setPromoValue(value: string) {
    this.promoValue = value;
  }

  addLoadedPhotos(photos: IPhoto[]): void {
    this.photos = this.photos.concat(photos);
  }

  addLoadedToFiltered(): void {
    this.filteredPhotos = this.photos;
    this.filteredByTitlePhotos = this.photos;
    this.filteredByParamsPhotos = this.photos;
  }

  initializeBasket(): void {
    const photosFromLocalStorage = JSON.parse(localStorage.getItem('photos to order'));
    photosFromLocalStorage.forEach(photo => {
      const keysArr = [...this.basket.keys()];
      if (keysArr.every(key => key.id !== photo.id)) {
        this.basket.add(photo);
      }
    });
  }

  addToBasket(photo: IPhoto): void {
    const keysArr = [...this.basket.keys()];
    if (keysArr.every(key => key.id !== photo.id)) {
      this.basket.add(photo);
    }
    this.updateLocalStorage([...this.basket.values()]);
  }

  updateLocalStorage(photos: IPhoto[]): void {
    localStorage.setItem('photos to order', JSON.stringify(photos));
  }

  removePhotoFromBasket(id: string): void {
    let desiredPhoto: IPhoto;
    for (const photo of this.basket) {
      if (photo.id === id) {
        desiredPhoto = photo;
      }
    }
    this.basket.delete(desiredPhoto);
    localStorage.clear();
    this.updateLocalStorage([...this.basket.values()]);
  }

  findById(id: string): IPhoto {
    return this.photos.find(photo => photo.id === id);
  }

  filterBasket(orders: IPhoto[]): void {
    this.clearBasket();
    orders.forEach(order => {
      this.basket.add(order);
    });
  }

  resetIsSelected(): void {
    this.photos.forEach(photo => photo.isSelected = false);
  }

  filteringPhotos(popularityFilterValue: number, priceFilterValue: number): void {
    /*this.filteredByParamsPhotos = this.filteredByTitlePhotos.filter(photo => {
      if (popularityFilterValue) {
        if (photo.price <= priceFilterValue && photo.popularity === popularityFilterValue) {
          return photo;
        }
      } else {
        return photo.price <= priceFilterValue;
      }
    });*/
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
