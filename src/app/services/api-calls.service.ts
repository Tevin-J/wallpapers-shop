import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { Params } from '../models/filters.model';
import { Item, SearchPhotosRequest } from '../models/photo.model';

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {
  constructor(private http: HttpClient) {
  }

  /*метод запроса с сервера порции фотографий*/
  fetchWallpapers(page: number): Observable<string> {
    const clientId = 'Z2U-DGy55aYJGgH-2m8y7mNMlwXSEXw0tWsxs4k-snM';
    return this.http.get<any>(`http://localhost:3000/api/photos?clientId=${clientId}&page=${page}`);
  }

  searchPhotos(params: Params): Observable<any> {
    const reqParams: SearchPhotosRequest = {
      term: params.term,
    };
    if (params.page) {
      reqParams.page = params.page;
    }
    if (params.price) {
      reqParams.price = params.price;
    }
    if (params.color) {
      reqParams.color = params.color;
    }
    if (params.orientation) {
      reqParams.orientation = params.orientation;
    }
    const {term, color, orientation, price, page} = reqParams;
    const clientId = 'Z2U-DGy55aYJGgH-2m8y7mNMlwXSEXw0tWsxs4k-snM';
    if (term && !color && !orientation && !price) {
      return this.http.get<any>(`http://localhost:3000/api/search/photos?clientId=${clientId}&page=${page}&term=${term}`);
    } else if (term && !color && !orientation && price) {
      return this.http.get<any>(`http://localhost:3000/api/search/photos?clientId=${clientId}&page=${page}&term=${term}&price=${price}`);
    } else if (term && color && orientation && price){
      return this.http.get<any>(`http://localhost:3000/api/search/photos?clientId=${clientId}&page=${page}&price=${price}&orientation=${orientation}&color=${color}&term=${term}`);
    } else if (term && color && orientation && !price){
      return this.http.get<any>(`http://localhost:3000/api/search/photos?clientId=${clientId}&page=${page}&orientation=${orientation}&color=${color}&term=${term}`);
    } else if (term && color && !orientation && price) {
      return this.http.get<any>(`http://localhost:3000/api/search/photos?clientId=${clientId}&page=${page}&price=${price}&color=${color}&term=${term}`);
    } else if (term && color && !orientation && !price) {
      return this.http.get<any>(`http://localhost:3000/api/search/photos?clientId=${clientId}&page=${page}&color=${color}&term=${term}`);
    } else if (term && !color && orientation && price) {
      return this.http.get<any>(`http://localhost:3000/api/search/photos?clientId=${clientId}&page=${page}&price=${price}&orientation=${orientation}&term=${term}`);
    } else if (term && !color && orientation && !price) {
      return this.http.get<any>(`http://localhost:3000/api/search/photos?clientId=${clientId}&page=${page}&orientation=${orientation}&term=${term}`);
    }
  }

  submitPromo(promo: string): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/promo/apply', {promo});
  }

  makeOrder(items: Item[], promo: string, cost: number): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/order', {items, promo, cost});
  }

  /*метод оплаты покупок*/
  purchase(): Observable<number> {
       return this.http.get<any>('http://localhost:3000/api/purchase');
  }
}
