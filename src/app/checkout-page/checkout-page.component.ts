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

  /*корзина, получаемая из корзины в appService. та корзина - Set, эта - массив*/
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

    /*кладем в массив basket ключи из Set basket*/
    this.basket = [...this.appService.basket.keys()];

    /*высчитываем стоимость всех фото из корзины*/
    this.initialCost = [...this.appService.basket.keys()].reduce((acc, val) => {
      return +acc + +val.price;
    }, 0);

    /*инициализируем форму по вводу промокода*/
    this.promoForm = new FormGroup({
      promo: new FormControl('', [Validators.required, this.correctPromo])
    });
  }

  /*валидатор проверки правильности промокода*/
  correctPromo(control: FormControl): {[key: string]: boolean} {
    if (control.value !== 'banana') {
      return {
        invalidPromo: true
      };
    }
    return null;
  }

  /*метод удаления фото из корзины*/
  removePhoto(id) {
    this.basket = this.basket.filter(p => p.id !== id);
    this.appService.basket.forEach(((value, value2, set) => {
      if (value.id === id) {
        set.delete(value);
      }
    }));

    /*пересчитываем цену на основе обновленной корзины*/
    this.initialCost = [...this.appService.basket.keys()].reduce((acc, val) => {
      return +acc + +val.price;
    }, 0);
    this.isPromoApplied = false;
    this.finalCost = null;
  }

  /*метод сабмита формы*/
  submitPromo() {
    const formData = {...this.promoForm.value};
    if (this.promo === formData.promo) {
      /*пересчет срабатывает только если сумма покупок больше $5*/
      if (this.initialCost >= 5) {
        this.finalCost = Math.floor(this.initialCost * 0.8);
        this.isPromoApplied = true;
      }
    }
  }

  /*метод оплаты покупок, на "сервере" случайно определяем успешно ли прошла оплата*/
  purchase() {
    this.isPurchaseSucceed = null;
    this.popupIsShowed = true;
    this.subscription = this.apiCallsService.purchase().subscribe(response => {
      this.isPurchaseSucceed = response;
    });
  }

  /*если оплата прошла успешно, то при нажатии соответствующей кнопки в модальном окне, вызовется
  данный метод, который очистит корзину и сделает отписку*/
  clearAll() {
    this.appService.clearBasket();
    this.subscription.unsubscribe();
  }

}
