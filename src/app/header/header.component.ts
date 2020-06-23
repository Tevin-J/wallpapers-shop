import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from '../services/app-service.service';
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  href: string;

  routerChangingSubscription;

  constructor(public appService: AppService, private router: Router) {
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

  ngOnDestroy(): void {
    if (this.routerChangingSubscription) {
      this.routerChangingSubscription.unsubscribe();
    }
  }
}
