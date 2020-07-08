import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from '../services/app-service.service';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {ApiCallsService} from '../services/api-calls.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  href: string;
  term: string;
  routerChangingSubscription;

  getPhotosSubscription;

  searchByTitleSubscription;

  constructor(public appService: AppService, public apiCallsService: ApiCallsService, private router: Router) {
    /*подписываемся на изменение url, чтоб в зависимости от его значения отрисовывать
    в header либо инпут для фильтрации картинок по названию, либо кнопку для перехода
    на главную страницу*/
    this.routerChangingSubscription = router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.href = event.url;
    });
  }

  ngOnInit(): void {
  }

  /*метод поиска картинок по введеному в инпут значению*/
  searchWallpapersByTitle(): void {

    this.getPhotosSubscription = this.appService.activeFilters.next({ searchTerm: this.term });
    /*if (term) {
      this.searchByTitleSubscription = this.apiCallsService.searchByTitle(term)
        .subscribe(response => {
          this.appService.photos = JSON.parse(response);
        });
    } else {
      this.searchByTitleSubscription = this.apiCallsService.fetchWallpapers()
        .subscribe(response => {
          this.appService.photos = JSON.parse(response);
        });
    }*/

    /*this.appService.filteredByTitlePhotos = this.appService.photos.filter(p => {
      if (p.description) {
        return p.description.toLowerCase().includes(term.toLowerCase());
      } else {
        return p;
      }
    });
    this.appService.filteredPhotos = this.appService.filteredByTitlePhotos;*/
  }

  ngOnDestroy(): void {
    if (this.routerChangingSubscription) {
      this.routerChangingSubscription.unsubscribe();
    }
    if (this.getPhotosSubscription) {
      this.getPhotosSubscription.unsubscribe();
    }
    /*if (this.searchByTitleSubscription) {
      this.searchByTitleSubscription.unsubscribe();
    }*/
  }
}
