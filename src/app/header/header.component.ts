import { Component, OnInit } from '@angular/core';
import {AppService} from '../services/app-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public appService: AppService) { }

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
