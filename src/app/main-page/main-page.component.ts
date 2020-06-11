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

  fetchWallpapers() {
    this.apiCallsService.fetchWallpapers()
      .subscribe(response => {
        response.forEach(p => {
          p.price = Math.floor(Math.random() * 10 + 1);
          p.isSelected = false;
        });
        this.appService.photos = response;
        this.appService.filteredByParamsPhotos = this.appService.photos;
        this.appService.filteredByTitlePhotos = this.appService.photos;
        this.appService.filteredPhotos = this.appService.photos;
      });
  }

  openPopup(id) {
    this.openedPhoto = this.appService.photos.find(p => p.id === id);
  }

  closePopup() {
    this.openedPhoto = null;
  }

  addToBasketFromPopup() {
    this.appService.basket.add(this.openedPhoto);
    this.closePopup();
  }

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

  addToBasket() {
    for (const value of this.selectedPhotos) {
      this.appService.basket.add(value);
    }
    this.selectedPhotos = [];
    this.appService.photos.forEach(p => p.isSelected = false);
  }

  showSettingsPopup() {
    this.popupIsShowed = !this.popupIsShowed;
  }

  applyFilters() {
    this.showSettingsPopup();
    this.appService.filteredByParamsPhotos = this.appService.filteredByTitlePhotos.filter(p => p.price <= this.priceFilterValue);
    this.appService.filteredPhotos = this.appService.filteredByParamsPhotos;
  }

}
