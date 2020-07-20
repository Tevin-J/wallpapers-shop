import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { delay, filter, map, tap } from 'rxjs/operators';
import { Photo } from '../models/photo.model';
import { ApiCallsService } from '../services/api-calls.service';
import { AppService } from '../services/app-service.service';
import {
  SetFilters,
  GetPhotos,
  SelectPhoto,
  ShowSettingsPopup,
  SetSearchTerm,
  ApplyFilters,
  ClearAllFilters,
  InitializeBasket,
  MakePhotoOpen,
  MakePhotoClose,
  AddPhotoToBasket,
  SetInitCost,
  RemovePhotoFromBasket,
  SubmitPromo,
  InitializePurchasingState,
  GetPurchaseStatus, MakeOrder, FinishPurchasing, ChangeColorFilter, ChangeOrientationFilter
} from './shop.actions';

export interface ShopStateModel {
  photos: Photo[];
  openedPhoto: Photo;
  selectedPhotos: Photo[];
  isFiltersPopupShowed: boolean;
  price: number;
  color: string;
  orientation: string;
  href: string;
  term: string;
  basket: Photo[];
  initialCost: number;
  finalCost: number;
  isPromoApplied: boolean;
  isPurchasePopupShowed: boolean;
  isPurchaseSucceed: number;
}

@State<ShopStateModel>({
  name: 'shopState',
  defaults: {
    photos: [],
    openedPhoto: null,
    selectedPhotos: [],
    isFiltersPopupShowed: false,
    price: undefined,
    color: undefined,
    orientation: undefined,
    href: '',
    term: '',
    basket: [],
    initialCost: 0,
    finalCost: null,
    isPromoApplied: false,
    isPurchasePopupShowed: false,
    isPurchaseSucceed: 0
  }
})
@Injectable()
export class ShopState {
  constructor(private appService: AppService, private apiCallsService: ApiCallsService) {
  }

  @Selector()
  static photos(state: ShopStateModel): Photo[] {
    return state.photos;
  }

  @Selector()
  static basket(state: ShopStateModel): Photo[] {
    return state.basket;
  }

  @Selector()
  static openedPhoto(state: ShopStateModel): Photo {
    return state.openedPhoto;
  }

  @Selector()
  static selectedPhotos(state: ShopStateModel): Photo[] {
    return state.selectedPhotos;
  }

  @Selector()
  static isFiltersPopupShowed(state: ShopStateModel): boolean {
    return state.isFiltersPopupShowed;
  }

  @Selector()
  static price(state: ShopStateModel): number {
    return state.price;
  }

  @Selector()
  static color(state: ShopStateModel): string {
    return state.color;
  }

  @Selector()
  static orientation(state: ShopStateModel): string {
    return state.orientation;
  }

  @Selector()
  static initialCost(state: ShopStateModel): number {
    return state.initialCost;
  }

  @Selector()
  static finalCost(state: ShopStateModel): number {
    return state.finalCost;
  }

  @Selector()
  static isPromoApplied(state: ShopStateModel): boolean {
    return state.isPromoApplied;
  }

  @Selector()
  static isPurchasePopupShowed(state: ShopStateModel): boolean {
    return state.isPurchasePopupShowed;
  }

  @Selector()
  static isPurchaseSucceed(state: ShopStateModel): number {
    return state.isPurchaseSucceed;
  }

  @Action(SetFilters)
  setFilters(ctx: StateContext<ShopStateModel>, action: SetFilters) {
    const state = ctx.getState();
    const filters = {
      color: state.color,
      price: state.price,
      orientation: state.orientation,
      searchTerm: state.term
    };
    this.appService.activeFilters.next(filters);
  }

  @Action(GetPhotos)
  getPhotos(ctx: StateContext<ShopStateModel>, action: GetPhotos) {
    return this.appService.getPhotos$
      .pipe(
        map(response => {
          const photos = JSON.parse(response);
          photos.forEach(photo => {
            photo.isSelected = false;
          });
          return photos;
        })
      ).subscribe(data => {
        const state = ctx.getState();
        const page = this.appService.page;
        if (page === 1) {
          ctx.setState({
            ...state,
            photos: data
          });
        } else {
          ctx.setState({
            ...state,
            photos: [...state.photos, ...data]
          });
        }
        this.appService.page++;
      });
  }

  @Action(SetSearchTerm)
  setSearchTerm(ctx: StateContext<ShopStateModel>, action: SetSearchTerm) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      term: action.searchTerm
    });
  }

  @Action(ChangeColorFilter)
  changeColorFilter(ctx: StateContext<ShopStateModel>, action: ChangeColorFilter) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      color: action.color
    });
  }

  @Action(ChangeOrientationFilter)
  changeOrientationFilter(ctx: StateContext<ShopStateModel>, action: ChangeOrientationFilter) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      orientation: action.orientation
    });
  }

  @Action(ClearAllFilters)
  clearAllFilters(ctx: StateContext<ShopStateModel>, action: ClearAllFilters) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      term: undefined,
      price: undefined,
      color: undefined,
      orientation: undefined
    });
  }

  @Action(ApplyFilters)
  applyFilters(ctx: StateContext<ShopStateModel>, action: ApplyFilters) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      color: action.color,
      price: action.price,
      orientation: action.orientation
    });
  }

  @Action(InitializeBasket)
  initializeBasket(ctx: StateContext<ShopStateModel>, action: InitializeBasket) {
    const state = ctx.getState();
    const basket = [...state.basket];
    if (localStorage.getItem('photos to order')) {
      const photosFromLocalStorage = JSON.parse(localStorage.getItem('photos to order'));
      photosFromLocalStorage.forEach(photo => {
        basket.push(photo);
      });
      ctx.setState({
        ...state,
        basket: [...state.basket, ...basket]
      });
    }
  }

  @Action(MakePhotoOpen)
  makePhotoOpen(ctx: StateContext<ShopStateModel>, action: MakePhotoOpen) {
    const state = ctx.getState();
    const photo = state.photos.find(p => p.id === action.id);
    ctx.setState({
      ...state,
      openedPhoto: photo
    });
  }

  @Action(MakePhotoClose)
  makePhotoClose(ctx: StateContext<ShopStateModel>, action: MakePhotoClose) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      openedPhoto: null
    });
  }

  @Action(AddPhotoToBasket)
  addPhotoToBasket(ctx: StateContext<ShopStateModel>, action: AddPhotoToBasket) {
    console.log(action.photo);
    const state = ctx.getState();
    if (action.photo.isSelected) {
      const newSelected = [...state.selectedPhotos].filter(photo => photo.id !== action.photo.id);
      const newPhotos = state.photos.map(photo => {
        if (photo.id === action.photo.id) {
          return {
            ...photo,
            isSelected: false
          };
        } else {
          return photo;
        }
      });
      ctx.setState({
        ...state,
        photos: newPhotos,
        selectedPhotos: newSelected
      });
    }
    const state2 = ctx.getState();
    if (state2.basket.every(photo => photo.id !== action.photo.id)) {
      ctx.setState({
        ...state2,
        basket: [...state2.basket, action.photo]
      });
      const state3 = ctx.getState();
      localStorage.setItem('photos to order', JSON.stringify(state3.basket));
    }
  }

  @Action(SelectPhoto)
  selectPhoto(ctx: StateContext<ShopStateModel>, action: SelectPhoto) {
    const state = ctx.getState();

    const updatedSelected: Photo[] = state.selectedPhotos.filter(selectedPhoto => selectedPhoto.id !== action.id);
    if (updatedSelected.length === state.selectedPhotos.length) {
      const updatedPhotos = state.photos.map(updatedPhoto => {
        if (updatedPhoto.id === action.id) {
          return {
            ...updatedPhoto,
            isSelected: true
          };
        } else {
          return updatedPhoto;
        }
      });
      const photo: Photo = updatedPhotos.find(p => p.id === action.id);
      ctx.setState({
        ...state,
        selectedPhotos: [...state.selectedPhotos, photo],
        photos: updatedPhotos
      });
    } else {
      const updatedPhotos = state.photos.map(updatedPhoto => {
        if (updatedPhoto.id === action.id) {
          return {
            ...updatedPhoto,
            isSelected: false
          };
        } else {
          return updatedPhoto;
        }
      });
      ctx.setState({
        ...state,
        selectedPhotos: updatedSelected,
        photos: updatedPhotos
      });
    }
  }

  @Action(ShowSettingsPopup)
  showSettingsPopup(ctx: StateContext<ShopStateModel>, action: ShowSettingsPopup) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      isFiltersPopupShowed: !state.isFiltersPopupShowed
    });
  }

  @Action(SetInitCost)
  setInitCost(ctx: StateContext<ShopStateModel>, action: SetInitCost) {
    const state = ctx.getState();
    const cost = state.basket.reduce((acc: number, photo: Photo) => {
      return acc + photo.price;
    }, 0);
    ctx.setState({
      ...state,
      initialCost: cost
    });
  }

  @Action(RemovePhotoFromBasket)
  removePhotoFromBasket(ctx: StateContext<ShopStateModel>, action: RemovePhotoFromBasket) {
    const state = ctx.getState();
    const newBasket = [...state.basket].filter(photo => photo.id !== action.id);
    const cost = newBasket.reduce((acc: number, photo: Photo) => {
      return acc + photo.price;
    }, 0);
    ctx.setState({
      ...state,
      basket: newBasket,
      initialCost: cost,
      finalCost: null,
      isPromoApplied: false
    });
    localStorage.clear();
    localStorage.setItem('photos to order', JSON.stringify(newBasket));
  }

  @Action(SubmitPromo)
  submitPromo(ctx: StateContext<ShopStateModel>, action: SubmitPromo) {
    this.apiCallsService.submitPromo(action.promo)
      .subscribe(discount => {
        const state = ctx.getState();
        if (discount !== 1) {
          ctx.setState({
            ...state,
            finalCost: state.initialCost * discount,
            isPromoApplied: true
          });
        }
      });
  }

  @Action(InitializePurchasingState)
  initializePurchasingState(ctx: StateContext<ShopStateModel>, action: InitializePurchasingState) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      isPurchaseSucceed: null,
      isPurchasePopupShowed: true
    });
  }

  @Action(GetPurchaseStatus)
  getPurchaseStatus(ctx: StateContext<ShopStateModel>, action: GetPurchaseStatus) {
    return this.apiCallsService.purchase()
      .pipe(
        delay(2000),
        tap(value => {
          const state = ctx.getState();
          if (!value) {
            ctx.setState({
              ...state,
              isPurchaseSucceed: value
            });
          }
        }),
        filter(value => value === 1)
      );
  }

  @Action(MakeOrder)
  makeOrder(ctx: StateContext<ShopStateModel>, action: MakeOrder) {
    this.apiCallsService.makeOrder(action.items, action.promo, action.cost)
      .subscribe(response => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          isPurchaseSucceed: 1
        });
      });
  }

  @Action(FinishPurchasing)
  finishPurchasing(ctx: StateContext<ShopStateModel>, action: FinishPurchasing) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      isPurchasePopupShowed: false,
      basket: []
    });
    localStorage.clear();
    this.appService.page = 1;
  }
}
