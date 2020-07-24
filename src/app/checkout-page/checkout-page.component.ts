import {Component, OnDestroy, OnInit} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Photo } from '../models/photo.model';
import {AppService} from '../services/app-service.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import {
  FinishPurchasing,
  GetPurchaseStatus,
  InitializePurchasingState, MakeOrder,
  RemovePhotoFromBasket,
  SetInitCost,
  SubmitPromo
} from '../store/shop.actions';
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

  @Select(ShopState.isPromoApplied)
  public isPromoApplied$: Observable<boolean>;

  @Select(ShopState.isPurchasePopupShowed)
  public isPurchasePopupShowed$: Observable<boolean>;

  @Select(ShopState.isPurchaseSucceed)
  public isPurchaseSucceed$: Observable<number>;

  basket: Photo[];

  promoForm: FormGroup;

  initialCost: number;

  finalCost: number;

  isPromoApplied: boolean;

  isPurchasePopupShowed: boolean;

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

    this.isPromoApplied$
      .subscribe(data => {
        this.isPromoApplied = data;
      });

    this.isPurchasePopupShowed$
      .subscribe(data => {
        this.isPurchasePopupShowed = data;
      });

    this.isPurchaseSucceed$
      .subscribe(data => {
        this.isPurchaseSucceed = data;
      });

    this.store.dispatch(new SetInitCost());

    /*инициализируем форму по вводу промокода*/
    this.promoForm = new FormGroup({
      promo: new FormControl('', [Validators.required])
    });
  }

  /*метод удаления фото из корзины*/
  removePhoto(id: string): void {
    this.store.dispatch(new RemovePhotoFromBasket(id));
  }

  /*метод сабмита формы*/
  submitPromo(): void {
    const formData = {...this.promoForm.value};
    this.store.dispatch(new SubmitPromo(formData.promo));
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
    this.store.dispatch(new InitializePurchasingState());
    this.store.dispatch(new GetPurchaseStatus())
      .subscribe(value => {
        this.store.dispatch(new MakeOrder(photosToOrder, this.promoForm.value.promo, cost));
      });
  }

  clearAll(): void {
    this.store.dispatch(new FinishPurchasing());
  }

  ngOnDestroy(): void {
    if (this.purchaseSubscription) {
      this.purchaseSubscription.unsubscribe();
    }
  }

}
