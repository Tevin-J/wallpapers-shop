import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { Photo } from '../models/photo.model';
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
  MakePhotoClose, AddPhotoToBasket, SetInitCost, RemovePhotoFromBasket
} from './shop.actions';

export interface ShopStateModel {
  photos: Photo[];
  openedPhoto: Photo;
  selectedPhotos: Photo[];
  filtersIsShowed: boolean;
  price: number;
  color: string;
  orientation: string;
  href: string;
  term: string;
  basket: Photo[];
  initialCost: number;
  finalCost: number;
  isPromoApplied: boolean;
  isPopupShowed: boolean;
  isPurchaseSucceed: number;
}

@State<ShopStateModel>({
  name: 'shopState',
  defaults: {
    photos: [],
    openedPhoto: null,
    selectedPhotos: [],
    filtersIsShowed: false,
    price: undefined,
    color: undefined,
    orientation: undefined,
    href: '',
    term: '',
    basket: [],
    initialCost: 0,
    finalCost: null,
    isPromoApplied: false,
    isPopupShowed: false,
    isPurchaseSucceed: 0
  }
})
@Injectable()
export class ShopState {
  constructor(private appService: AppService) {}

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
  static isPopupShowed(state: ShopStateModel): boolean {
    return state.isPopupShowed;
  }

  @Selector()
  static initialCost(state: ShopStateModel): number {
    return state.initialCost;
  }

  @Selector()
  static finalCost(state: ShopStateModel): number {
    return state.finalCost;
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
    const state = ctx.getState();
    if (action.photo.isSelected) {
      const newSelected = [...state.selectedPhotos].filter(photo => photo.id !== action.photo.id);
      const newPhotos = [...state.photos];
      newPhotos.forEach(photo => {
        if (photo.id === action.photo.id) {
          photo.isSelected = false;
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
      const photo = state.photos.find(p => p.id === action.id);
      const updatedPhotos = [...state.photos];
      updatedPhotos.forEach(updatedPhoto => {
        if (updatedPhoto.id === action.id) {
          debugger
          updatedPhoto.isSelected = true;
        }
      });
      ctx.setState({
        ...state,
        selectedPhotos: [...state.selectedPhotos, photo],
        photos: updatedPhotos
      });
    } else {
      const updatedPhotos = [...state.photos];
      updatedPhotos.forEach(photo => {
        if (photo.id === action.id) {
          photo.isSelected = false;
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
      isPopupShowed: !state.isPopupShowed
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
      finalCost: null
    });
    localStorage.clear();
    localStorage.setItem('photos to order', JSON.stringify(newBasket));
  }
}

