import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {

  result = new Observable<number>(res => {
    setTimeout(() => {
      res.next(Math.round(Math.random()));
    }, 2000);
  });

  constructor(private http: HttpClient) { }

  fetchWallpapers(): Observable<any> {
    let params = new HttpParams();
    params = params.set('client_id', 'E-7mojK6FreK7uOgbFmb7maACxNSf6c97u19GGNtfcU');
    params.append('page', '1');
    params = params.append('per_page', '6');
    return this.http.get<any>('https://api.unsplash.com/photos/', {
      params
    });
  }

  purchase(): Observable<number> {
    return this.result;
  }
}
