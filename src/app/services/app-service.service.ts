import { Injectable } from '@angular/core';
import {ApiCallsService} from './api-calls.service';

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

  priceFilterValue;

  colorFilterValue;

  orientationFilterValue;

  basket: Set<IPhoto> = new Set();

  photos: IPhoto[] = [];

  filteredByParamsPhotos: IPhoto[] = [];

  filteredByTitlePhotos: IPhoto[] = [];

  filteredPhotos: IPhoto[] = [];

  constructor(public apiCallsService: ApiCallsService) { }

  setPromoValue(value: string) {
    this.promoValue = value;
  }

  getPhotos() {
    this.photos = [];
    this.getScrolledPhotos();
  }

  getScrolledPhotos() {
    if (!this.searchTerm && !this.priceFilterValue && !this.colorFilterValue && !this.orientationFilterValue) {
      this.apiCallsService.fetchWallpapers()
        .subscribe(response => {
          const photos: IPhoto[] = JSON.parse(response);
          photos.forEach(photo => {
            photo.isSelected = false;
          });

          // добавляем порцию загруженных фото в общий массив фотографий
          this.addLoadedPhotos(photos);
        });
    } else {
      this.apiCallsService.searchPhotos(this.priceFilterValue, this.colorFilterValue, this.orientationFilterValue, this.searchTerm)
        .subscribe(response => {
          const photos: IPhoto[] = JSON.parse(response);
          photos.forEach(photo => {
            photo.isSelected = false;
          });

          // добавляем порцию загруженных фото в общий массив фотографий
          this.addLoadedPhotos(photos);
        });
    }
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
