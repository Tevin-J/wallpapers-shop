import {Component, OnInit, AfterViewInit} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Photo } from '../models/photo.model';
import {
  AddPhotoToBasket,
  ApplyFilters,
  GetPhotos,
  InitializeBasket, MakePhotoClose,
  MakePhotoOpen, SelectPhoto,
  SetFilters, ShowSettingsPopup
} from '../store/shop.actions';
import { ShopState } from '../store/shop.state';

interface Color {
  value: string;
}
interface Orientation {
  value: string;
}
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, AfterViewInit {

  @Select(ShopState.photos)
  public photos$: Observable<Photo[]>;

  @Select(ShopState.openedPhoto)
  public openedPhoto$: Observable<Photo>;

  @Select(ShopState.selectedPhotos)
  public selectedPhotos$: Observable<Photo[]>;

  @Select(ShopState.isPopupShowed)
  public isPopupShowed$: Observable<boolean>;

  photos: Photo[];

  openedPhoto: Photo;

  selectedPhotos: Photo[];

  isPopupShowed: boolean;

  price: number | null;

  color: string | null;

  orientation: string | null;

  colors: Color[] = [
    { value: 'black_and_white' },
    { value: 'black' },
    { value: 'white' },
    { value: 'yellow' },
    { value: 'orange' },
    { value: 'red' },
    { value: 'purple' },
    { value: 'magenta' },
    { value: 'green' },
    { value: 'teal' },
    { value: 'blue' }
  ];

  orientations: Orientation[] = [
    { value: 'landscape' },
    { value: 'portrait' },
    { value: 'squarish' }
  ];

  constructor(
    private store: Store
  ) {}

  ngOnInit(): void {
    this.initializeBasket();
    this.getPhotos();
    this.selectedPhotos$
      .subscribe(data => {
        this.selectedPhotos = data;
      });
    this.isPopupShowed$
      .subscribe(data => {
        this.isPopupShowed = data;
      });
  }

  public ngAfterViewInit() {
    this.store.dispatch(new SetFilters());
  }

  getPhotos(): void {
    this.photos$
      .subscribe(data => {
        this.photos = data;
      });
    this.store.dispatch(new GetPhotos());
  }

  /*initial getting photos to basket from local storage*/
  initializeBasket(): void {
    this.store.dispatch(new InitializeBasket());
  }

  /*метод открытия модалки для данного фото*/
  openPopup(id: string): void {
    this.openedPhoto$
      .subscribe(data => {
        this.openedPhoto = data;
      });
    this.store.dispatch(new MakePhotoOpen(id));
  }

  closePopup(): void {
    this.store.dispatch(new MakePhotoClose());
  }

  /*метод добавления {} фотографии в корзину для дальнейшей ее покупки*/
  addToBasketFromPopup(): void {
    this.store.dispatch(new AddPhotoToBasket(this.openedPhoto));
    this.store.dispatch(new MakePhotoClose());
  }

  /*метод нажатия на чекбокс у фото - помещение в массив отмеченных товаров для дальнейшего
  их помещения в корзину*/
  selectPhoto(id: string): void {
    this.store.dispatch(new SelectPhoto(id));
  }

  /*метод добавления фото в корзину.*/
  addToBasket(): void {
    this.selectedPhotos.forEach(photo => {
      this.store.dispatch(new AddPhotoToBasket(photo));
    });
  }

  /*метод открытия-закрытия окна с настройками фильтрации*/
  showSettingsPopup(): void {
    this.store.dispatch(new ShowSettingsPopup());
  }

  /*метод фильтрации фото по параметрам*/
  applyFilters(): void {
    this.showSettingsPopup();
    this.store.dispatch(new ApplyFilters(this.color, this.price, this.orientation));
    this.store.dispatch(new SetFilters());
  }

  /*метод, загружающий новые фото при скролле до конца страницы*/
  onScroll(): void {
    this.store.dispatch(new SetFilters());
  }

  onColorFilterValueChanged(event): void {
    this.color = event.source.value;
  }

  onOrientationFilterValueChanged(event): void {
    this.orientation = event.source.value;
  }
}
