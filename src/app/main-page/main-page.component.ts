import {Component, OnInit} from '@angular/core';
import {ApiCallsService} from '../services/api-calls.service';
import {AppService, IPhoto} from '../services/app-service.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  openedPhoto = null as IPhoto;

  selectedPhotos = [] as Array<IPhoto>;

  popupIsShowed = false;

  priceFilterValue = 10;

  constructor(
    public apiCallsService: ApiCallsService,
    public appService: AppService
  ) { }

  ngOnInit(): void {
    this.fetchWallpapers();
  }

  /*метод загрузки фото на страницу через метод сервиса по запросам на сервер. в каждый {} пришедшей
  фотографии добавляем свойства price и isSelected*/
  fetchWallpapers() {
    this.apiCallsService.fetchWallpapers()
      .subscribe(response => {
        response.forEach(p => {
          p.price = Math.floor(Math.random() * 10 + 1);
          p.isSelected = false;
        });

        /*добавляем порцию загруженных фото в общий массив фотографий*/
        this.appService.photos = this.appService.photos.concat(response);

        /*заполняем массивы отсортированных фото общим массивом фото, чтоб в дальнейшем этими
        данными манипулировать при сортировке*/
        this.appService.filteredByParamsPhotos = this.appService.photos;
        this.appService.filteredByTitlePhotos = this.appService.photos;
        this.appService.filteredPhotos = this.appService.photos;
      });
  }

  /*метод открытия модалки для данного фото*/
  openPopup(id) {
    this.openedPhoto = this.appService.photos.find(p => p.id === id);
  }

  /*метод закрытия модалки*/
  closePopup() {
    this.openedPhoto = null;
  }

  /*метод добавления {} фотографии в корзину для дальнейшей ее покупки*/
  addToBasketFromPopup() {
    this.appService.basket.add(this.openedPhoto);
    this.closePopup();
  }

  /*метод нажатия на чекбокс у фото - помещение в массив отмеченных товаров для дальнейшего
  их помещения в корзину*/
  selectPhoto(id) {
    const updatedSelected = this.selectedPhotos.filter(p => p.id !== id);
    if (updatedSelected.length === this.selectedPhotos.length) {
      this.appService.photos.find(p => p.id === id).isSelected = true;
      this.selectedPhotos.push(this.appService.photos.find(p => p.id === id));
    } else {
      this.appService.photos.find(p => p.id === id).isSelected = false;
      this.selectedPhotos = updatedSelected;
    }
  }

  /*метод добавления фото в корзину. корзина - карта*/
  addToBasket() {
    for (const value of this.selectedPhotos) {
      this.appService.basket.add(value);
    }
    this.selectedPhotos = [];
    this.appService.photos.forEach(p => p.isSelected = false);
  }

  /*метод открытия-закрытия окна с настройками фильтрации*/
  showSettingsPopup() {
    this.popupIsShowed = !this.popupIsShowed;
  }

  /*метод фильтрации фото по параметрам*/
  applyFilters() {
    this.showSettingsPopup();
    this.appService.filteredByParamsPhotos = this.appService.filteredByTitlePhotos.filter(p => p.price <= this.priceFilterValue);
    this.appService.filteredPhotos = this.appService.filteredByParamsPhotos;
  }

  /*метод, загружающий новые фото при скролле до конца страницы*/
  onScroll() {
    this.fetchWallpapers();
  }

}
