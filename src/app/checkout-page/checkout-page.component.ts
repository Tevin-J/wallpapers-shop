import { Component, OnInit } from '@angular/core';
import {AppService, IPhoto} from '../services/app-service.service';
import {ApiCallsService} from '../services/api-calls.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit {

  basket: Array<IPhoto> = [];

  promo = 'banana';

  promoForm: FormGroup;

  initialCost = 0;

  finalCost: number;

  isPromoApplied = false;

  popupIsShowed = false;

  isPurchaseSucceed: number;

  subscription;

  constructor(public appService: AppService, public apiCallsService: ApiCallsService) { }

  ngOnInit(): void {
    this.basket = [...this.appService.basket.keys()];
    this.initialCost = [...this.appService.basket.keys()].reduce((acc, val) => {
      return +acc + +val.price;
    }, 0);

    this.promoForm = new FormGroup({
      promo: new FormControl('', [Validators.required, this.correctPromo])
    });
  }

  correctPromo(control: FormControl): {[key: string]: boolean} {
    if (control.value !== 'banana') {
      return {
        invalidPromo: true
      };
    }
    return null;
  }

  removePhoto(id) {
    this.basket = this.basket.filter(p => p.id !== id);
    this.appService.basket.forEach(((value, value2, set) => {
      if (value.id === id) {
        set.delete(value);
      }
    }));
    this.initialCost = [...this.appService.basket.keys()].reduce((acc, val) => {
      return +acc + +val.price;
    }, 0);
    this.isPromoApplied = false;
    this.finalCost = null;
  }

  submitPromo() {
    const formData = {...this.promoForm.value};
    if (this.promo === formData.promo) {
      if (this.initialCost >= 5) {
        this.finalCost = Math.floor(this.initialCost * 0.8);
        this.isPromoApplied = true;
      }
    }
  }

  purchase() {
    this.isPurchaseSucceed = null;
    this.popupIsShowed = true;
    this.subscription = this.apiCallsService.purchase().subscribe(response => {
      this.isPurchaseSucceed = response;
    });
  }

  clearAll() {
    this.popupIsShowed = false;
    this.isPurchaseSucceed = null;
    this.appService.clearBasket();
    this.subscription.unsubscribe();
  }

}
