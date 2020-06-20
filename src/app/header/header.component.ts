import { Component, OnInit } from '@angular/core';
import {AppService} from '../services/app-service.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [Location]
})
export class HeaderComponent implements OnInit {

  /*необходим для определения - показывать или нет поисковый инпут*/
  location: Location;

  constructor(public appService: AppService, location: Location) {
    this.location = location;
  }

  ngOnInit(): void {
  }

  /*метод поиска картинок по введеному в инпут значению*/
  searchWallpapersByTitle(term: string): void {
    this.appService.filteredByTitlePhotos = this.appService.photos.filter(p => {
      if (p.description) {
        return p.description.toLowerCase().includes(term.toLowerCase());
      } else {
        return p;
      }
    });
    this.appService.filteredPhotos = this.appService.filteredByTitlePhotos;
  }
}
