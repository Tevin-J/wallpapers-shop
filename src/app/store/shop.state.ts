import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Photo } from '../models/photo.model';
import { AppService, IPhoto } from '../services/app-service.service';
import {
  AddLoadedPhotos, AddToBasketFromPopup, ChangeColor, ChangeOrientation,
  ClearSelectedPhotos,
  FindPhotoById,
  GetPhotos, ResetIsSelected, SearchPhotosByTitle,
  SelectPhoto,
  ShowSettingsPopup, UpdateLocalStorage
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
  page: number;
  basket: Set<Photo>;
  basketArr: Photo[];
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
    price: null,
    color: null,
    orientation: null,
    href: '',
    term: '',
    page: 1,
    basket: new Set<Photo>(),
    basketArr: [],
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

  @Action(AddLoadedPhotos)
  addLoadedPhotos(ctx: StateContext<ShopStateModel>, action: AddLoadedPhotos) {
    const state = ctx.getState();
    const page = state.page;
    if (page === 1) {
      ctx.setState({
        ...state,
        photos: action.loadedPhotos,
        page: state.page++
      });
    } else {
      ctx.setState({
        ...state,
        photos: [...state.photos, ...action.loadedPhotos]
      });
    }
  }

  // @Action(SelectPhoto)
  // selectPhoto(ctx: StateContext<PhotosStateModel>, action: SelectPhoto) {
  //   const state = ctx.getState();
  //   const updatedSelected: Photo[] = state.selectedPhotos.filter(photo => photo.id !== action.id);
  //   if (updatedSelected.length === state.selectedPhotos.length) {
  //     this.findPhotoById(id).isSelected = true;
  //     state.selectedPhotos.push(this.findById(id));
  //   } else {
  //     this.findById(id).isSelected = false;
  //     state.selectedPhotos = updatedSelected;
  //   }
  // }

  @Action(FindPhotoById)
  findPhotoById(ctx: StateContext<ShopStateModel>, action: FindPhotoById) {
    const state = ctx.getState();
    return state.photos.find(photo => photo.id === action.id);
  }

  @Action(ClearSelectedPhotos)
  clearSelectedPhotos(ctx: StateContext<ShopStateModel>, action: ClearSelectedPhotos) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      selectedPhotos: []
    });
  }

  @Action(ShowSettingsPopup)
  showSettingsPopup(ctx: StateContext<ShopStateModel>, action: ShowSettingsPopup) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      isPopupShowed: !state.isPopupShowed
    });
  }

  @Action(AddToBasketFromPopup)
  addToBasketFromPopup(ctx: StateContext<ShopStateModel>, action: AddToBasketFromPopup) {
    const state = ctx.getState();
    const basket = state.basket;
    const basketKeys = [...state.basket.keys()];
    if (basketKeys.every(key => key.id !== action.openedPhoto.id)) {
      basket.add(action.openedPhoto);
    }
    ctx.setState({
      ...state,
      basket
    });
  }

  @Action(UpdateLocalStorage)
  updateLocalStorage(ctx: StateContext<ShopStateModel>, action: UpdateLocalStorage) {
    localStorage.setItem('photos to order', JSON.stringify(action.photosFromBasket));
  }

  @Action(ChangeColor)
  changeColor(ctx: StateContext<ShopStateModel>, action: ChangeColor) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      color: action.colorValue
    });
  }

  @Action(ChangeOrientation)
  changeOrientation(ctx: StateContext<ShopStateModel>, action: ChangeOrientation) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      orientation: action.orientationValue
    });
  }

  @Action(SearchPhotosByTitle)
  searchPhotosByTitle(ctx: StateContext<ShopStateModel>, action: SearchPhotosByTitle) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      page: 1,
      color: null,
      price: null,
      orientation: null
    });
    this.appService.activeFilters.next({
      color: state.color, price: state.price, orientation: state.orientation, searchTerm: state.term
    });
  }

  @Action(ResetIsSelected)
  resetIsSelected(ctx: StateContext<ShopStateModel>, action: ResetIsSelected) {
    const state = ctx.getState();
    const photos = state.photos;
    const updatedPhotos = photos.map(photo => {
      return {
        ...photo,
        isSelected: false
        };
    });
    ctx.setState({
      ...state,
      photos: updatedPhotos
    });
  }
}

