import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { map, mergeMap, tap } from 'rxjs/operators';
import { Photo } from '../models/photo.model';
import { AppService, IPhoto } from '../services/app-service.service';
import {
  AddLoadedPhotos,
  ChangeColor,
  SetFilters,
  ChangeOrientation,
  ClearSelectedPhotos,
  GetPhotos,
  ResetIsSelected,
  SelectPhoto,
  ShowSettingsPopup,
  UpdateLocalStorage,
  SetSearchTerm,
  ApplyFilters,
  ClearAllFilters,
  InitializeBasket,
  MakePhotoOpen,
  MakePhotoClose, AddPhotoToBasket
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
  // basket: Set<Photo>;
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
    // basket: new Set<Photo>(),
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
    if (state.basket.every(photo => photo.id !== action.photo.id)) {
      ctx.setState({
        ...state,
        basket: [...state.basket, action.photo]
      });
      const newState = ctx.getState();
      localStorage.setItem('photos to order', JSON.stringify(newState.basket));
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

  // @Action(FindPhotoById)
  // findPhotoById(ctx: StateContext<ShopStateModel>, action: FindPhotoById) {
  //   const state = ctx.getState();
  //   return state.photos.find(photo => photo.id === action.id);
  // }

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

