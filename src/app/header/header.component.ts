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

  location: Location;

  constructor(public appService: AppService, location: Location) {
    this.location = location;
  }

  ngOnInit(): void {
  }

  searchWallpapersByTitle(term: string) {
    this.appService.filteredByTitlePhotos = this.appService.photos.filter(p => {
      if (p.alt_description) {
        return p.alt_description.toLowerCase().includes(term.toLowerCase());
      } else {
        return p;
      }
    });
    this.appService.filteredPhotos = this.appService.filteredByTitlePhotos;
  }
}
