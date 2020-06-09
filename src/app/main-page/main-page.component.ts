import { Component, OnInit } from '@angular/core';
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
        response.forEach(p => p.price = Math.floor(Math.random() * 10 + 1));
        this.appService.photos = response;
      });
  }

  openPopup(id) {
    this.openedPhoto = this.appService.photos.find(p => p.id === id);
  }

  closePopup() {
    this.openedPhoto = null;
  }

  addToBasketFromPopup() {
    this.appService.basket.push(this.openedPhoto);
    this.closePopup();
  }

  selectPhoto(id) {
    const updatedSelected = this.selectedPhotos.filter(p => p.id !== id);
    if (updatedSelected.length === this.selectedPhotos.length) {
      this.selectedPhotos.push(this.appService.photos.find(p => p.id === id));
    } else {
      this.selectedPhotos = updatedSelected;
    }
  }

  addToBasket() {
    this.appService.basket.push(...this.selectedPhotos);
    this.selectedPhotos = [];
  }

}
