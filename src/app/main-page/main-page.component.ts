import {Component, OnDestroy, OnInit, AfterViewInit} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { Photo } from '../models/photo.model';
import {AppService, IPhoto} from '../services/app-service.service';
import {
  AddLoadedPhotos, AddPhotoToBasket,
  ApplyFilters,
  GetPhotos,
  InitializeBasket, MakePhotoClose,
  MakePhotoOpen,
  SetFilters
} from '../store/shop.actions';
import { ShopState } from '../store/shop.state';

interface IColor {
  value: string;
}
interface IOrientation {
  value: string;
}
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @Select(ShopState.photos)
  public photos$: Observable<Photo[]>;

  @Select(ShopState.openedPhoto)
  public openedPhoto$: Observable<Photo>;



  photos: IPhoto[];

  openedPhoto = null as IPhoto;

  selectedPhotos = [] as IPhoto[];

  popupIsShowed = false;

  price: number | null;

  color: string | null;

  orientation: string | null;

  colors: IColor[] = [
    {value: 'black_and_white'},
    {value: 'black'},
    {value: 'white'},
    {value: 'yellow'},
    {value: 'orange'},
    {value: 'red'},
    {value: 'purple'},
    {value: 'magenta'},
    {value: 'green'},
    {value: 'teal'},
    {value: 'blue'}
  ];

  orientations: IOrientation[] = [
    {value: 'landscape'},
    {value: 'portrait'},
    {value: 'squarish'}
  ];

  getPhotosSubscription;

  getScrolledPhotosSubscription;

  applyFiltersSubscription;

  constructor(
    private appService: AppService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.initializeBasket();
    this.getPhotos();
  }

  public ngAfterViewInit() {
    this.store.dispatch(new SetFilters());
    // this.appService.activeFilters.next({ color: undefined, price: undefined, orientation: undefined, searchTerm: undefined });
  }

  getPhotos(): void {
    this.photos$
      .subscribe(data => {
        this.photos = data;
      });
    this.store.dispatch(new GetPhotos());

    // this.getPhotosSubscription = this.appService.getPhotos$
    //   .subscribe(response => {
    //     const photos = JSON.parse(response);
    //     photos.forEach(photo => {
    //       photo.isSelected = false;
    //     });
    //     this.addLoadedPhotos(photos);
    //   });
  }

  // addLoadedPhotos(photos: IPhoto[]): void {
  //   if (this.appService.page === 1) {
  //     this.photos = photos;
  //     this.appService.page++;
  //   } else {
  //     this.photos = this.photos.concat(photos);
  //   }
  // }

  /*initial getting photos to basket from local storage*/
  initializeBasket(): void {
    this.store.dispatch(new InitializeBasket());
    // this.appService.initializeBasket();
  }

  /*метод открытия модалки для данного фото*/
  openPopup(id: string): void {
    this.openedPhoto$
      .subscribe(data => {
        this.openedPhoto = data;
      });
    this.store.dispatch(new MakePhotoOpen(id));
    // this.openedPhoto = this.findById(id);
  }

  /*метод закрытия модалки*/
  closePopup(): void {
    this.store.dispatch(new MakePhotoClose());
  }

  /*метод добавления {} фотографии в корзину для дальнейшей ее покупки*/
   addToBasketFromPopup(): void {
     this.store.dispatch(new AddPhotoToBasket(this.openedPhoto));
     // this.appService.addToBasket(this.openedPhoto);
     this.closePopup();
  }

  /*метод нажатия на чекбокс у фото - помещение в массив отмеченных товаров для дальнейшего
  их помещения в корзину*/
  selectPhoto(id: string): void {
    const updatedSelected: IPhoto[] = this.selectedPhotos.filter(photo => photo.id !== id);
    if (updatedSelected.length === this.selectedPhotos.length) {
      this.findById(id).isSelected = true;
      this.selectedPhotos.push(this.findById(id));
    } else {
      this.findById(id).isSelected = false;
      this.selectedPhotos = updatedSelected;
    }
  }

  findById(id: string): IPhoto {
    return this.photos.find(photo => photo.id === id);
  }

  /*метод добавления фото в корзину. корзина - Set*/
  addToBasket(): void {
    this.selectedPhotos.forEach(photo => {
      this.appService.addToBasket(photo);
    });
    this.selectedPhotos = [];
    this.resetIsSelected();
  }

  resetIsSelected(): void {
    this.photos.forEach(photo => photo.isSelected = false);
  }

  /*метод открытия-закрытия окна с настройками фильтрации*/
  showSettingsPopup(): void {
    this.popupIsShowed = !this.popupIsShowed;
  }

  /*метод фильтрации фото по параметрам*/
  applyFilters(): void {
    this.showSettingsPopup();
    this.store.dispatch(new ApplyFilters(this.color, this.price, this.orientation));
    this.store.dispatch(new SetFilters());
    // this.applyFiltersSubscription = this.appService.activeFilters.next({ color: this.color, price: this.price, orientation: this.orientation });
    /*this.price = undefined;
    this.color = undefined;
    this.orientation = undefined;*/
  }

  /*метод, загружающий новые фото при скролле до конца страницы*/
  onScroll(): void {
    this.store.dispatch(new SetFilters());
    // this.getScrolledPhotosSubscription = this.appService.activeFilters.next({ color: this.color, price: this.price, orientation: this.orientation });
  }

  onColorFilterValueChanged(event): void {
    this.color = event.source.value;
  }

  onOrientationFilterValueChanged(event): void {
    this.orientation = event.source.value;
  }

  ngOnDestroy(): void {
    if (this.getPhotosSubscription) {
      this.getPhotosSubscription.unsubscribe();
    }
    if (this.getScrolledPhotosSubscription) {
      this.getScrolledPhotosSubscription.unsubscribe();
    }
    if (this.applyFiltersSubscription) {
      this.applyFiltersSubscription.unsubscribe();
    }
  }

}
