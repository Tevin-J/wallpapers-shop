import { Photo } from '../models/photo.model';

export class SetFilters {
  static readonly type = '[Filters] Set Filters';
}

export class GetPhotos {
  static readonly type = '[Photos] Get Photos';
}

export class AddLoadedPhotos {
  static readonly type = '[Photos] Add Loaded Photos';
  constructor(public loadedPhotos: Photo[]) {}
}

export class SetSearchTerm {
  static readonly type = '[Filters] Set Search Term';
  constructor(public searchTerm: string) {}
}

export class ClearAllFilters {
  static readonly type = '[Filters] Clear All Filters';
}

export class ApplyFilters {
  static readonly type = '[Filters] Apply Filters';
  constructor(public color: string, public price: number, public orientation: string) {}
}

export class InitializeBasket {
  static readonly type = '[Basket] Initialize Basket';
}

export class MakePhotoOpen {
  static readonly type = '[Photos] Make Photo Open';
  constructor(public id: string) {}
}

export class MakePhotoClose {
  static readonly type = '[Photos] Make Photo Close';
}

export class SelectPhoto {
  static readonly type = '[Photos] Select Photo';
  constructor(public id: string) {}
}

export class ResetIsSelected {
  static readonly type = '[Photos] Reset Is Selected';
}

export class RemoveFromBasket {
  static readonly type = '[Basket] Remove From Basket';
  constructor(public photoId: string) {}
}

export class ClearSelectedPhotos {
  static readonly type = '[Photos] Clear Selected Photos';
}

export class OpenPhotoPopup {
  static readonly type = '[Photos] Open Photo Popup';
  constructor(public id: string) {}
}

export class ClosePhotoPopup {
  static readonly type = '[Photos] Close Photo Popup';
}

export class AddPhotoToBasket {
  static readonly type = '[Basket] Add Photo To Basket';
  constructor(public photo: Photo) {}
}

export class ShowSettingsPopup {
  static readonly type = '[Filters] Show Settings Popup';
}

export class UpdateLocalStorage {
  static readonly type = '[Basket] Update Local Storage';
  constructor(public photosFromBasket: Photo[]) {
  }
}

export class ChangeColor {
  static readonly type = '[Filters] Change Color';
  constructor(public colorValue: any) {}
}

export class ChangeOrientation {
  static readonly type = '[Filters] Change Orientation';
  constructor(public orientationValue: any) {}
}

