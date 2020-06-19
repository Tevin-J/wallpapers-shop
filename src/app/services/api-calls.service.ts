import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {

  /*номер порции фотографий для загрузки с сервера, с каждым запросом увеличивается на 1*/
  page = 1;

  constructor(private http: HttpClient) { }

  /*метод запроса с сервера порции фотографий*/
  fetchWallpapers(): Observable<any> {
    let page = this.page
    this.page++
    return this.http.get<any>(`http://localhost:3000/photos?page=${page}`);
  }

  getPromo(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/promo')
  }

  addToOrder(orders): Observable<any> {
    return this.http.post<any>('http://localhost:3000/orders', orders);
  }

  removeFromOrder(id): Observable<any> {
    return this.http.delete<any>(`http://localhost:3000/orders/remove/${id}`)
  }

  /*метод оплаты покупок*/
  purchase(): Observable<number> {
    return this.http.get<any>('http://localhost:3000/purchase')
  }

  clearAllOrders(): Observable<any> {
    return this.http.delete<any>('http://localhost:3000/orders/remove')
  }
}
