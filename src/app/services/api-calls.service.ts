import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IPhoto} from "./app-service.service";

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {

  /*номер порции фотографий для загрузки с сервера, с каждым запросом увеличивается на 1*/
  page: number = 1;

  constructor(private http: HttpClient) { }

  /*метод запроса с сервера порции фотографий*/
  fetchWallpapers(): Observable<string> {
    let page: number = this.page;
    this.page++;
    return this.http.get<any>(`http://localhost:3000/photos?page=${page}`);
  }

  getPromo(): Observable<string> {
    return this.http.get<any>('http://localhost:3000/promo')
  }

  changePromo(value: string): Observable<string> {
    return this.http.put<any>('http://localhost:3000/promo', {value})
  }

  addToOrder(orders: IPhoto[]): Observable<string> {
    return this.http.post<any>('http://localhost:3000/orders', orders);
  }

  removeFromOrder(id: number): Observable<string> {
    return this.http.delete<any>(`http://localhost:3000/orders/remove/${id}`)
  }

  /*метод оплаты покупок*/
  purchase(): Observable<number> {
    return this.http.get<any>('http://localhost:3000/purchase')
  }

  clearAllOrders(): Observable<string> {
    return this.http.delete<any>('http://localhost:3000/orders/remove')
  }
}
