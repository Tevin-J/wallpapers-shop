import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiCallsService} from '../services/api-calls.service';
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

  popupIsShowed: boolean = false;

  priceFilterValue: number = 100;

  colorFilterValue = null as string;

  orientationFilterValue = null as string;

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

  fetchWallpapersSubscription;

  addToBasketFromPopupSubscription;

  addSelectedToBasketSubscription;

  constructor(
    public apiCallsService: ApiCallsService,
    public appService: AppService
  ) { }

  ngOnInit(): void {
    /*this.fetchWallpapers();*/
    this.initializeBasket();
    this.appService.getPhotos();
  }

  /*метод загрузки фото на страницу через метод сервиса по запросам на сервер. в каждый {} пришедшей
  фотографии добавляем свойство isSelected*/
  fetchWallpapers(): void {
    this.fetchWallpapersSubscription = this.apiCallsService.fetchWallpapers()
      .subscribe(response => {
        const photos: IPhoto[] = JSON.parse(response);
        photos.forEach(photo => {
          photo.isSelected = false;
        });

        // добавляем порцию загруженных фото в общий массив фотографий
        this.appService.addLoadedPhotos(photos);

        // заполняем массивы отсортированных фото общим массивом фото, чтоб в дальнейшем этими
        // данными манипулировать при сортировке
        this.appService.addLoadedToFiltered();
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

     /*this.addToBasketFromPopupSubscription = this.apiCallsService.addToOrder([this.openedPhoto])
      .subscribe(response => {
        let orderedPhoto: IPhoto[] = JSON.parse(response);
        this.appService.addToBasket((orderedPhoto)[orderedPhoto.length - 1]);
      });*/
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
    /*this.addSelectedToBasketSubscription = this.apiCallsService.addToOrder(this.selectedPhotos)
      .subscribe(response => {
        let orderedPhotos: IPhoto[] = JSON.parse(response);
        orderedPhotos.forEach(photo => {
          this.appService.addToBasket(photo)
        });
        this.selectedPhotos = [];
        this.appService.resetIsSelected();
      })*/
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
    this.appService.getPhotos();
    /*this.apiCallsService.searchPhotos(this.priceFilterValue, this.colorFilterValue, this.orientationFilterValue, this.appService.searchTerm)
      .subscribe(response => {
        this.appService.photos = JSON.parse(response);
      });*/
    console.log(this.appService.orientationFilterValue, this.appService.colorFilterValue, this.appService.priceFilterValue, this.appService.searchTerm);
    /*this.colorFilterValue = null;
    this.orientationFilterValue = null;*/
    /*this.appService.filteringPhotos(this.popularityFilterValue, this.priceFilterValue);
    this.popularityFilterValue = null;
    this.appService.setFilteredPhotos();*/
  }

  /*метод, загружающий новые фото при скролле до конца страницы*/
  onScroll(): void {
    /*if (this.appService.basicScrollMode) {
      this.fetchWallpapers();
    }*/
    /*this.fetchWallpapers();*/
    this.appService.getScrolledPhotos();
  }

  onColorFilterValueChanged(event): void {
    this.appService.colorFilterValue = event.source.value;
  }

  onOrientationFilterValueChanged(event): void {
    this.appService.orientationFilterValue = event.source.value;
  }

  ngOnDestroy(): void {
    if (this.fetchWallpapersSubscription) {
      this.fetchWallpapersSubscription.unsubscribe();
    }
    this.fetchWallpapersSubscription.unsubscribe();
    if (this.addToBasketFromPopupSubscription) {
      this.addToBasketFromPopupSubscription.unsubscribe();
    }
    if (this.addSelectedToBasketSubscription) {
      this.addSelectedToBasketSubscription.unsubscribe();
    }
  }

}
