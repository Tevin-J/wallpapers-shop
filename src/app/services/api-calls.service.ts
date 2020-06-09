import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {

  constructor(private http: HttpClient) { }

  fetchWallpapers(): Observable<any> {
    let params = new HttpParams();
    params = params.set('client_id', 'E-7mojK6FreK7uOgbFmb7maACxNSf6c97u19GGNtfcU');
    params = params.append('per_page', '30');
    return this.http.get<any>('https://api.unsplash.com/photos/', {
      params
    });
  }
}
