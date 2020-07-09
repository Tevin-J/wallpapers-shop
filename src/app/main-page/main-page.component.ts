import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService, IPhoto} from '../services/app-service.service';

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
export class MainPageComponent implements OnInit, OnDestroy {

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
    public appService: AppService
  ) { }

  ngOnInit(): void {
    this.initializeBasket();
    this.getPhotos();
  }

  getPhotos(): void {
    this.getPhotosSubscription = this.appService.getPhotos$
      .subscribe(response => {
      });
  }

  /*initial getting photos to basket from local storage*/
  initializeBasket(): void {
    this.appService.initializeBasket();
  }

  /*метод открытия модалки для данного фото*/
  openPopup(id: string): void {
    this.openedPhoto = this.appService.findById(id);
  }

  /*метод закрытия модалки*/
  closePopup(): void {
    this.openedPhoto = null;
  }

  /*метод добавления {} фотографии в корзину для дальнейшей ее покупки*/
   addToBasketFromPopup(): void {
     this.appService.addToBasket(this.openedPhoto);
     this.closePopup();
  }

  /*метод нажатия на чекбокс у фото - помещение в массив отмеченных товаров для дальнейшего
  их помещения в корзину*/
  selectPhoto(id: string): void {
    const updatedSelected: IPhoto[] = this.selectedPhotos.filter(photo => photo.id !== id);
    if (updatedSelected.length === this.selectedPhotos.length) {
      this.appService.findById(id).isSelected = true;
      this.selectedPhotos.push(this.appService.findById(id));
    } else {
      this.appService.findById(id).isSelected = false;
      this.selectedPhotos = updatedSelected;
    }
  }

  /*метод добавления фото в корзину. корзина - Set*/
  addToBasket(): void {
    this.selectedPhotos.forEach(photo => {
      this.appService.addToBasket(photo);
    });
    this.selectedPhotos = [];
    this.appService.resetIsSelected();
  }

  /*метод открытия-закрытия окна с настройками фильтрации*/
  showSettingsPopup(): void {
    this.popupIsShowed = !this.popupIsShowed;
  }

  /*метод фильтрации фото по параметрам*/
  applyFilters(): void {
    this.showSettingsPopup();
    this.applyFiltersSubscription = this.appService.activeFilters.next({ color: this.color, price: this.price, orientation: this.orientation });
    /*this.price = undefined;
    this.color = undefined;
    this.orientation = undefined;*/
  }

  /*метод, загружающий новые фото при скролле до конца страницы*/
  onScroll(): void {
    this.getScrolledPhotosSubscription = this.appService.activeFilters.next({ color: this.color, price: this.price, orientation: this.orientation });
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
