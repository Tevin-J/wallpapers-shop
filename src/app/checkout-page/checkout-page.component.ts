import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {AppService, IPhoto} from '../services/app-service.service';
import {ApiCallsService} from '../services/api-calls.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { delay, filter, switchMap, tap } from 'rxjs/operators';
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

  constructor(private appService: AppService, private apiCallsService: ApiCallsService) {
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

  /*метод удаления фото из корзины*/
  removePhoto(id: string): void {
    this.appService.removePhotoFromBasket(id);
    this.basket = this.appService.getKeysOfBasket();

    /*пересчитываем цену на основе обновленной корзины*/
    this.initialCost = this.basket.reduce((acc, val) => {
      return +acc + +val.price;
    }, 0);
    this.finalCost = null;
  }

  /*метод сабмита формы*/
  submitPromo(): void {
    const formData = {...this.promoForm.value};
    this.apiCallsService.submitPromo(formData.promo)
      .subscribe(discount => {
        if (discount !== 1) {
          this.finalCost = this.initialCost * discount;
          this.isPromoApplied = true;
        }
      });
  }

  /*method to purchase order. if success - calling makeOrder method*/
  purchase(): void {
    const cost = this.finalCost ? this.finalCost : this.initialCost;
    const photosToOrder = [];
    this.basket.forEach(photo => {
      const photoObj = {
        id: photo.id,
        url: photo.urlSmall
      };
      photosToOrder.push(photoObj);
    });
    this.isPurchaseSucceed = null;
    this.popupIsShowed = true;
    this.purchaseSubscription = this.apiCallsService.purchase()
      .pipe(
        delay(2000),
        tap(value => {
          if (value === 0) {
            this.isPurchaseSucceed = value;
          }
        }),
        filter(value => value === 1),
        switchMap((value: number, index: number): ObservableInput<any> => {
          return this.apiCallsService.makeOrder(photosToOrder, this.promoForm.value.promo, cost);
        })
      )
      .subscribe(items => {
        this.clearAll();
        this.isPurchaseSucceed = 1;
      });
  }

  clearAll(): void {
    this.appService.clearBasket();
  }

  ngOnDestroy(): void {
    if (this.purchaseSubscription) {
      this.purchaseSubscription.unsubscribe();
    }
  }

}
