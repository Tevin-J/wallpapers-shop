import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {AppService, IPhoto} from '../services/app-service.service';
import {ApiCallsService} from '../services/api-calls.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {filter, switchMap, tap} from 'rxjs/operators';
import {ObservableInput} from 'rxjs';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit, OnDestroy {

  /*корзина, получаемая из корзины в appService. та корзина - Set, эта - массив*/
  basket: IPhoto[] = [];

  promoForm: FormGroup;

  initialCost = 0;

  finalCost: number;

  isPromoApplied = false;

  popupIsShowed = false;

  isPurchaseSucceed: number;

  purchaseSubscription;

  makeOrderSubscription;

  clearOrdersSubscription;

  removeFromOrderSubscription;

  constructor(public appService: AppService, public apiCallsService: ApiCallsService) {
  }

  ngOnInit(): void {


    /*кладем в массив basket ключи из Set basket*/
    this.basket = this.appService.getKeysOfBasket();

    /*высчитываем стоимость всех фото из корзины*/
    this.initialCost = this.appService.getKeysOfBasket().reduce((acc, val) => {
      return +acc + +val.price;
    }, 0);

    /*инициализируем форму по вводу промокода*/
    this.promoForm = new FormGroup({
      promo: new FormControl('', [Validators.required/*, this.correctPromo*/])
    });
  }

  /*валидатор проверки правильности промокода*/
  /*correctPromo(control: FormControl): {[key: string]: boolean} {
    debugger
    if (control.value !== this.promoValue) {
      return {
        invalidPromo: true
      };
    }
    return null;
  }*/

  /*метод удаления фото из корзины*/
  removePhoto(id: string): void {
    /*this.removeFromOrderSubscription = this.apiCallsService.removeFromOrder(id)
      .subscribe(response => {
        this.appService.filterBasket(JSON.parse(response));
        this.basket = this.appService.getKeysOfBasket();

        /!*пересчитываем цену на основе обновленной корзины*!/
        this.initialCost = this.appService.getKeysOfBasket().reduce((acc, val) => {
          return +acc + +val.price;
        }, 0);
        this.isPromoApplied = false;
        this.finalCost = null;
      })*/
    this.appService.removePhotoFromBasket(id);
    this.basket = this.appService.getKeysOfBasket();

    /*пересчитываем цену на основе обновленной корзины*/
    this.initialCost = this.basket.reduce((acc, val) => {
      return +acc + +val.price;
    }, 0);
    this.isPromoApplied = false;
    this.finalCost = null;
  }

  /*метод сабмита формы*/
  submitPromo(): void {
    const formData = {...this.promoForm.value};
    if (this.appService.promoValue === formData.promo) {
      /*пересчет срабатывает только если сумма покупок больше $5*/
      if (this.initialCost >= 5) {
        this.finalCost = Math.floor(this.initialCost * 0.8);
        this.isPromoApplied = true;
      }
    }
  }

  /*method to purchase order. if success - calling makeOrder method*/
  purchase(): void {
    const photosToOrder = [];
    this.basket.forEach(photo => {
      const photoObj = {
        id: photo.id,
        url: photo.urlSmall
      };
      photosToOrder.push(photoObj);
    });
    console.log(photosToOrder);
    console.log(this.promoForm.value.promo);
    console.log(this.initialCost);
    this.isPurchaseSucceed = null;
    this.popupIsShowed = true;
    this.purchaseSubscription = this.apiCallsService.purchase()
      .pipe(
        tap(value => {
          if (value === 0) {
            this.isPurchaseSucceed = value;
          }
        }),
        filter(value => value === 1),
        switchMap((value: number, index: number): ObservableInput<any> => {
          debugger
          return this.apiCallsService.makeOrder(photosToOrder, this.promoForm.value.promo, this.initialCost);
        }),
        tap(() => {
          this.isPurchaseSucceed = 1;
        })
      )
      .subscribe();
  }

  /*если оплата прошла успешно, то при нажатии соответствующей кнопки в модальном окне, вызовется
  данный метод, который очистит корзину и сделает отписку*/
  clearAll(): void {
    this.appService.clearBasket();
  }

  ngOnDestroy(): void {
    if (this.purchaseSubscription) {
      this.purchaseSubscription.unsubscribe();
    }
    if (this.clearOrdersSubscription) {
      this.clearOrdersSubscription.unsubscribe();
    }
    if (this.removeFromOrderSubscription) {
      this.removeFromOrderSubscription.unsubscribe();
    }
  }

}
