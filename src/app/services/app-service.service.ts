import {Injectable} from '@angular/core';
import { Filters } from '../models/filters.model';
import {ApiCallsService} from './api-calls.service';
import {pairwise, switchMap, tap} from 'rxjs/operators';
import {BehaviorSubject, Observable, ObservableInput} from 'rxjs';

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

export interface IFilters {
  searchTerm?: string;
  price?: number;
  color?: string;
  orientation?: string;
}

export interface IParams {
  term?: string;
  price?: number;
  color?: string;
  orientation?: string;
  page: number;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  promoValue = '';
  page = 1;
  basket: Set<IPhoto> = new Set();
  photos: IPhoto[] = [];
  getPhotos$: Observable<string>;
  activeFilters: BehaviorSubject<Filters>;

  constructor(public apiCallsService: ApiCallsService) {
    this.activeFilters = new BehaviorSubject(
      {color: undefined, price: undefined, orientation: undefined, searchTerm: undefined}
    );
    this.getPhotos$ = this.activeFilters.asObservable()
      .pipe(
        pairwise(),
        switchMap((filters: IFilters[], index): ObservableInput<any> => {
          const params: IParams = {page: this.page};
          if (filters[1].searchTerm) {
            params.term = filters[1].searchTerm;
          }
          if (filters[1].price) {
            params.price = filters[1].price;
          }
          if (filters[1].color) {
            params.color = filters[1].color;
          }
          if (filters[1].orientation) {
            params.orientation = filters[1].orientation;
          }
          if ((filters[0].color !== filters[1].color || filters[0].orientation !== filters[1].orientation ||
            filters[0].searchTerm !== filters[1].searchTerm || filters[0].price !== filters[1].price) || (
              filters[1].searchTerm === undefined && filters[1].price === undefined
              && filters[1].orientation === undefined && filters[1].color === undefined && this.page === 1
          )) {
            this.page = 1;
          }
          params.page = this.page;
          console.log(params);
          console.log(filters);
          if (!params.term && !params.price && !params.color && !params.orientation) {
            return this.apiCallsService.fetchWallpapers(this.page);
          } else {
            return this.apiCallsService.searchPhotos(params);
          }
        })/*,
        tap(response => {
          const photos = JSON.parse(response);
          photos.forEach(photo => {
            photo.isSelected = false;
          });
          this.addLoadedPhotos(photos);
        })*/
      );
  }

  /*addLoadedPhotos(photos: IPhoto[]): void {
    if (this.page === 1) {
      this.photos = photos;
    } else {
      this.photos = this.photos.concat(photos);
    }
  }*/

  initializeBasket(): void {
    if (localStorage.getItem('photos to order')) {
      const photosFromLocalStorage = JSON.parse(localStorage.getItem('photos to order'));
      photosFromLocalStorage.forEach(photo => {
        const keysArr = [...this.basket.keys()];
        if (keysArr.every(key => key.id !== photo.id)) {
          this.basket.add(photo);
        }
      });
    }
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

  /*findById(id: string): IPhoto {
    return this.photos.find(photo => photo.id === id);
  }*/

  /*filterBasket(orders: IPhoto[]): void {
    this.clearBasket();
    orders.forEach(order => {
      this.basket.add(order);
    });
  }*/

  /*resetIsSelected(): void {
    this.photos.forEach(photo => photo.isSelected = false);
  }*/

  /*filteringPhotos(popularityFilterValue: number, priceFilterValue: number): void {
    this.filteredByParamsPhotos = this.filteredByTitlePhotos.filter(photo => {
      if (popularityFilterValue) {
        if (photo.price <= priceFilterValue && photo.popularity === popularityFilterValue) {
          return photo;
        }
      } else {
        return photo.price <= priceFilterValue;
      }
    });
  }*/

  /*setFilteredPhotos(): void {
    this.filteredPhotos = this.filteredByParamsPhotos;
  }*/

  getKeysOfBasket(): IPhoto[] {
    return [...this.basket.keys()];
  }

  clearBasket(): void {
    this.basket.clear();
    localStorage.clear();
    this.page = 1;
  }
}
