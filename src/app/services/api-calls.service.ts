import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { Params } from '../models/filters.model';
import { Item } from '../models/photo.model';

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {
  constructor(private http: HttpClient) {
  }

  /*метод запроса с сервера порции фотографий*/
  fetchWallpapers(page: number): Observable<string> {
    const clientId = 'Z2U-DGy55aYJGgH-2m8y7mNMlwXSEXw0tWsxs4k-snM';
    return this.http.get<any>(`http://localhost:3000/photos?clientId=${clientId}&page=${page}`);
  }

  searchPhotos(params: Params): Observable<any> {
    const {term, color, orientation, price, page} = params;
    const clientId = 'Z2U-DGy55aYJGgH-2m8y7mNMlwXSEXw0tWsxs4k-snM';
    if (term && !color && !orientation && !price) {
      return this.http.get<any>(`http://localhost:3000/photos/search_by_params?clientId=${clientId}&page=${page}&term=${term}`);
    } else if (term && !color && !orientation && price) {
      return this.http.get<any>(`http://localhost:3000/photos/search_by_params?page=${page}&term=${term}&price=${price}`);
    } else if (term && color && orientation){
      return this.http.get<any>(`http://localhost:3000/photos/search_by_params?page=${page}&price=${price}&orientation=${orientation}&color=${color}&term=${term}`);
    } else if (term && color && !orientation) {
      return this.http.get<any>(`http://localhost:3000/photos/search_by_params?page=${page}&price=${price}&color=${color}&term=${term}`);
    } else if (term && !color && orientation) {
      return this.http.get<any>(`http://localhost:3000/photos/search_by_params?page=${page}&price=${price}&orientation=${orientation}&term=${term}`);
    }
  }

  submitPromo(promo: string): Observable<any> {
    return this.http.post<any>('http://localhost:3000/promo/apply', {promo});
  }

  makeOrder(items: Item[], promo: string, cost: number): Observable<any> {
    return this.http.post<any>('http://localhost:3000/orders', {items, promo, cost});
  }

  /*метод оплаты покупок*/
  purchase(): Observable<number> {
       return this.http.get<any>('http://localhost:3000/purchase');
  }
}
