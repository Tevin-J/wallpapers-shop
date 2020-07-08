import {Injectable} from '@angular/core';
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

  searchTerm = '';

  priceFilterValue;

  colorFilterValue;

  orientationFilterValue;

  page = 1;

  basket: Set<IPhoto> = new Set();

  photos: IPhoto[] = [];
  getPhotos$: Observable<any>;
  activeFilters: BehaviorSubject<IFilters>;

  constructor(public apiCallsService: ApiCallsService) {
    this.activeFilters = new BehaviorSubject(
      {searchTerm: this.searchTerm, price: this.priceFilterValue, color: this.colorFilterValue, orientation: this.orientationFilterValue}
    );
    this.getPhotos$ = this.activeFilters.asObservable()
      .pipe(
        pairwise(),
        switchMap((filters: IFilters[], index): ObservableInput<any> => {
          console.log(filters);
          if (filters[0].color !== filters[1].color || filters[0].orientation !== filters[1].orientation ||
            filters[0].searchTerm !== filters[1].searchTerm || filters[0].price !== filters[1].price) {
            this.page = 1;
          } else {
            this.page++;
          }
          const params: IParams = {page: this.page};
          if (this.searchTerm) {
            params.term = this.searchTerm;
          }
          if (this.priceFilterValue) {
            params.price = this.priceFilterValue;
          }
          if (this.colorFilterValue) {
            params.color = this.colorFilterValue;
          }
          if (this.orientationFilterValue) {
            params.orientation = this.orientationFilterValue;
          }
          if (!params.term) {
            this.colorFilterValue = null;
            this.orientationFilterValue = null;
            this.priceFilterValue = 1000;
          }
          if (!params.term && !params.price && !params.color && !params.orientation) {
            return this.apiCallsService.fetchWallpapers(this.page);
          } else {
            return this.apiCallsService.searchPhotos(params);
          }
        }),
        tap(photos => {
          photos.forEach(photo => {
            photo.isSelected = false;
          });
          if (this.page === 1) {
            this.photos = photos;
          } else {
            this.addLoadedPhotos(photos);
          }
        })
      );
  }
  /*getPhotos() {
    this.page = 1;
    this.photos = [];
    return this.getScrolledPhotos();
  }

  getScrolledPhotos() {
    this.page++;
    if (!this.searchTerm) {
      this.orientationFilterValue = null;
      this.colorFilterValue = null;
      return this.apiCallsService.fetchWallpapers(this.page)
        .pipe(
          map(response => {
            const photos: IPhoto[] = JSON.parse(response);
            photos.forEach(photo => {
              photo.isSelected = false;
            });

            // добавляем порцию загруженных фото в общий массив фотографий
            this.addLoadedPhotos(photos);
            return photos;
          })
        );
    } else {
      return this.apiCallsService.searchPhotos(this.priceFilterValue, this.colorFilterValue, this.orientationFilterValue, this.searchTerm, this.page)
        .pipe(
          map(response => {
            const photos: IPhoto[] = JSON.parse(response);
            photos.forEach(photo => {
              photo.isSelected = false;
            });

            // добавляем порцию загруженных фото в общий массив фотографий
            this.addLoadedPhotos(photos);
            return photos;
          })
        );
    }
  }*/

  addLoadedPhotos(photos: IPhoto[]): void {
    this.photos = this.photos.concat(photos);
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

  /*filterBasket(orders: IPhoto[]): void {
    this.clearBasket();
    orders.forEach(order => {
      this.basket.add(order);
    });
  }*/

  resetIsSelected(): void {
    this.photos.forEach(photo => photo.isSelected = false);
  }

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
  }
}
