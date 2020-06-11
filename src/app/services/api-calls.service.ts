import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {

  /*номер порции фотографий для загрузки с сервера, с каждым запросом увеличивается на 1*/
  page = 1;

  /*Observable для случайного определения спустя 2 секунды успешности оплаты*/
  result = new Observable<number>(res => {
    setTimeout(() => {
      res.next(Math.round(Math.random()));
    }, 2000);
  });

  constructor(private http: HttpClient) { }

  /*метод запроса с сервера порции фотографий*/
  fetchWallpapers(): Observable<any> {
    let params = new HttpParams();
    params = params.set('client_id', 'E-7mojK6FreK7uOgbFmb7maACxNSf6c97u19GGNtfcU');
    params = params.append('page', this.page.toString());
    params = params.append('per_page', '30');
    this.page ++;
    return this.http.get<any>('https://api.unsplash.com/photos/', {
      params
    });
  }

  /*метод оплаты покупок*/
  purchase(): Observable<number> {
    return this.result;
  }
}
