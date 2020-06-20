import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiCallsService} from '../services/api-calls.service';
import {AppService, IPhoto} from '../services/app-service.service';

interface IStars {
  value: number;
}
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, OnDestroy {

  openedPhoto = null as IPhoto;

  selectedPhotos = [] as Array<IPhoto>;

  popupIsShowed: boolean = false;

  priceFilterValue: number = 10;

  popularityFilterValue = null as number;

  stars: Array<IStars> = [
    {value: 1},
    {value: 2},
    {value: 3},
    {value: 4},
    {value: 5}
  ];

  fetchWallpapersSubscription;

  getPromoSubscription;

  addToBasketFromPopupSubscription;

  addSelectedToBasketSubscription;

  constructor(
    public apiCallsService: ApiCallsService,
    public appService: AppService
  ) { }

  ngOnInit(): void {
    this.fetchWallpapers();
    this.getPromo();
  }

  /*метод загрузки фото на страницу через метод сервиса по запросам на сервер. в каждый {} пришедшей
  фотографии добавляем свойства price и isSelected*/
  fetchWallpapers(): void {
    this.fetchWallpapersSubscription = this.apiCallsService.fetchWallpapers()
      .subscribe(response => {
        let photos: IPhoto[] = JSON.parse(response);
        photos.forEach(photo => {
          photo.isSelected = false;
        });

        /*добавляем порцию загруженных фото в общий массив фотографий*/
        this.appService.addLoadedPhotos(photos);

        /*заполняем массивы отсортированных фото общим массивом фото, чтоб в дальнейшем этими
        данными манипулировать при сортировке*/
        this.appService.addLoadedToFiltered();
      });
  }

  getPromo(): void {
    this.getPromoSubscription = this.apiCallsService.getPromo()
      .subscribe(response => {
        this.appService.setPromoValue(response)
      })
  }

  setNewPromoValue(value: string): void {
    this.apiCallsService.changePromo(value)
      .subscribe(response => {
        this.appService.setPromoValue(JSON.parse(response));
      })
  }

  /*метод открытия модалки для данного фото*/
  openPopup(id: number): void {
    this.openedPhoto = this.appService.findById(id);
  }

  /*метод закрытия модалки*/
  closePopup(): void {
    this.openedPhoto = null;
  }

  /*метод добавления {} фотографии в корзину для дальнейшей ее покупки*/
   addToBasketFromPopup(): void {
     this.addToBasketFromPopupSubscription = this.apiCallsService.addToOrder([this.openedPhoto])
      .subscribe(response => {
        let orderedPhoto: IPhoto[] = JSON.parse(response);
        this.appService.addToBasket((orderedPhoto)[orderedPhoto.length - 1]);
      });
     this.closePopup();
  }

  /*метод нажатия на чекбокс у фото - помещение в массив отмеченных товаров для дальнейшего
  их помещения в корзину*/
  selectPhoto(id: number): void {
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
    this.addSelectedToBasketSubscription = this.apiCallsService.addToOrder(this.selectedPhotos)
      .subscribe(response => {
        let orderedPhotos: IPhoto[] = JSON.parse(response);
        orderedPhotos.forEach(photo => {
          this.appService.addToBasket(photo)
        });
        this.selectedPhotos = [];
        this.appService.resetIsSelected();
      })
  }

  /*метод открытия-закрытия окна с настройками фильтрации*/
  showSettingsPopup(): void {
    this.popupIsShowed = !this.popupIsShowed;
  }

  /*метод фильтрации фото по параметрам*/
  applyFilters(): void {
    this.showSettingsPopup();
    this.appService.filteringPhotos(this.popularityFilterValue, this.priceFilterValue);
    this.popularityFilterValue = null;
    this.appService.setFilteredPhotos();
  }

  /*метод, загружающий новые фото при скролле до конца страницы*/
  onScroll(): void {
    this.fetchWallpapers();
  }

  onStarFilterValueChanged(event): void {
    this.popularityFilterValue = event.source.value;
  }

  ngOnDestroy(): void {
    this.fetchWallpapersSubscription.unsubscribe();
    if (this.addToBasketFromPopupSubscription) {
      this.addToBasketFromPopupSubscription.unsubscribe()
    }
    if (this.addSelectedToBasketSubscription) {
      this.addSelectedToBasketSubscription.unsubscribe()
    }
  }

}
