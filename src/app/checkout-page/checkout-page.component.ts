import { Component, OnInit } from '@angular/core';
import {AppService} from '../services/app-service.service';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit {

  basket = [];

  promo = 'discount';

  promoTerm = '';

  cost = 0;

  constructor(public appService: AppService) { }

  ngOnInit(): void {
    this.basket = [...this.appService.basket.keys()];
    this.cost = [...this.appService.basket.keys()].reduce((acc, val) => {
      return +acc + +val.price;
    }, 0);
  }

  removePhoto(id) {
    this.basket = this.basket.filter(p => p.id !== id);
    this.appService.basket.forEach(((value, value2, set) => {
      if (value.id === id) {
        set.delete(value);
      }
    }));
    this.cost = [...this.appService.basket.keys()].reduce((acc, val) => {
      return +acc + +val.price;
    }, 0);
  }

  comparePromo() {
    if (this.promo === this.promoTerm) {
      this.promoTerm = '';
      if (this.cost >= 5) {
        this.cost = Math.floor(this.cost * 0.8);
      }
    }
  }

}
