import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Photo } from '../models/photo.model';
import {AppService} from '../services/app-service.service';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {ApiCallsService} from '../services/api-calls.service';
import { ClearAllFilters, SetFilters, SetSearchTerm } from '../store/shop.actions';
import { ShopState } from '../store/shop.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Select(ShopState.basket)
  public basket$: Observable<Photo[]>;

  basket: Photo[];

  href: string;
  term: string;
  routerChangingSubscription;

  getPhotosSubscription;

  searchByTitleSubscription;

  constructor(public appService: AppService, public apiCallsService: ApiCallsService, private router: Router,
              private store: Store) {
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
    this.basket$
      .subscribe(data => {
        this.basket = data;
      });
  }

  /*метод поиска картинок по введеному в инпут значению*/
  searchWallpapersByTitle(): void {
    this.appService.page = 1;
    if (!this.term) {
      this.store.dispatch(new ClearAllFilters());
    } else {
      this.store.dispatch(new SetSearchTerm(this.term));
    }
    this.store.dispatch(new SetFilters());
    // this.getPhotosSubscription = this.appService.activeFilters.next({ color: undefined, price: undefined, orientation: undefined, searchTerm: this.term });
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
