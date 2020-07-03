import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppService, IPhoto} from './app-service.service';

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {
  /*номер порции фотографий для загрузки с сервера, с каждым запросом увеличивается на 1*/
  page = 1;

  constructor(private http: HttpClient, public appService: AppService) { }

  /*метод запроса с сервера порции фотографий*/
  fetchWallpapers(): Observable<string> {
    this.appService.basicScrollMode = true;
    const page: number = this.page;
    this.page++;
    const clientId = 'Z2U-DGy55aYJGgH-2m8y7mNMlwXSEXw0tWsxs4k-snM';
    return this.http.get<any>(`http://localhost:3000/photos?clientId=${clientId}&page=${page}`);
  }

  searchByTitle(term: string): Observable<any> {
    this.appService.basicScrollMode = false;
    const page: number = this.page;
    this.page++;
    return this.http.get<any>(`http://localhost:3000/photos/search_by_title?term=${term}&page=${page}`);
  }

  searchByParams(price: number, color?: string, orientation?: string, term?: string): Observable<any> {
    const page: number = this.page;
    this.page++;
    return this.http.get<any>(`http://localhost:3000/photos/search_by_params?price=${price}&orientation=${orientation}&color=${color}&term=${term}`);
  }

  addToOrder(orders: IPhoto[]): Observable<string> {
    return this.http.post<any>('http://localhost:3000/orders', orders);
  }

  makeOrder(photos: IPhoto[]): Observable<any> {
    return this.http.post<any>('http://localhost:3000/orders', photos);
  }

  removeFromOrder(id: string): Observable<string> {
    return this.http.delete<any>(`http://localhost:3000/orders/remove/${id}`);
  }

  /*метод оплаты покупок*/
  purchase(): Observable<number> {
    return this.http.get<any>('http://localhost:3000/purchase');
  }

  clearAllOrders(): Observable<string> {
    return this.http.delete<any>('http://localhost:3000/orders/remove');
  }
}
