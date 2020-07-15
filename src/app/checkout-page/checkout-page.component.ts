import {Component, OnDestroy, OnInit} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Photo } from '../models/photo.model';
import {AppService} from '../services/app-service.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { delay, filter, switchMap, tap } from 'rxjs/operators';
import { Observable, ObservableInput } from 'rxjs';
import { RemovePhotoFromBasket, SetInitCost } from '../store/shop.actions';
import { ShopState } from '../store/shop.state';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit, OnDestroy {

  @Select(ShopState.basket)
  public basket$: Observable<Photo[]>;

  @Select(ShopState.initialCost)
  public initialCost$: Observable<number>;

  @Select(ShopState.finalCost)
  public finalCost$: Observable<number>;

  basket: Photo[];

  promoForm: FormGroup;

  initialCost: number;

  finalCost: number;

  isPromoApplied = false;

  popupIsShowed = false;

  isPurchaseSucceed: number;

  purchaseSubscription;

  constructor(private appService: AppService, private store: Store) {
  }

  ngOnInit(): void {

    this.basket$
      .subscribe(data => {
        this.basket = data;
      });

    this.initialCost$
      .subscribe(data => {
        this.initialCost = data;
      });

    this.finalCost$
      .subscribe(data => {
        this.finalCost = data;
      });

    this.store.dispatch(new SetInitCost());

    /*инициализируем форму по вводу промокода*/
    this.promoForm = new FormGroup({
      promo: new FormControl('', [Validators.required/*, this.correctPromo*/])
    });
  }

  /*метод удаления фото из корзины*/
  removePhoto(id: string): void {
    this.store.dispatch(new RemovePhotoFromBasket(id));
  }

  /*метод сабмита формы*/
  // submitPromo(): void {
  //   const formData = {...this.promoForm.value};
  //   this.apiCallsService.submitPromo(formData.promo)
  //     .subscribe(discount => {
  //       if (discount !== 1) {
  //         this.finalCost = this.initialCost * discount;
  //         this.isPromoApplied = true;
  //       }
  //     });
  // }

  /*method to purchase order. if success - calling makeOrder method*/
  // purchase(): void {
  //   const cost = this.finalCost ? this.finalCost : this.initialCost;
  //   const photosToOrder = [];
  //   this.basket.forEach(photo => {
  //     const photoObj = {
  //       id: photo.id,
  //       url: photo.urlSmall
  //     };
  //     photosToOrder.push(photoObj);
  //   });
  //   this.isPurchaseSucceed = null;
  //   this.popupIsShowed = true;
  //   this.purchaseSubscription = this.apiCallsService.purchase()
  //     .pipe(
  //       delay(2000),
  //       tap(value => {
  //         if (value === 0) {
  //           this.isPurchaseSucceed = value;
  //         }
  //       }),
  //       filter(value => value === 1),
  //       switchMap((value: number, index: number): ObservableInput<any> => {
  //         return this.apiCallsService.makeOrder(photosToOrder, this.promoForm.value.promo, cost);
  //       })
  //     )
  //     .subscribe(items => {
  //       this.clearAll();
  //       this.isPurchaseSucceed = 1;
  //     });
  // }

  clearAll(): void {
    this.appService.clearBasket();
  }

  ngOnDestroy(): void {
    if (this.purchaseSubscription) {
      this.purchaseSubscription.unsubscribe();
    }
  }

}
