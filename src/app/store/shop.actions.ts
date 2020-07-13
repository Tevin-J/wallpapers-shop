import { Photo } from '../models/photo.model';

export class GetPhotos {
  static readonly type = '[Photos] Get Photos';
}

export class AddLoadedPhotos {
  static readonly type = '[Photos] AddLoaded Photos';
  constructor(public loadedPhotos: Photo[]) {}
}

export class FindPhotoById {
  static readonly type = '[Photos] Find Photo By Id';
  constructor(public id: string) {}
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

export class ShowSettingsPopup {
  static readonly type = '[Filters] Show Settings Popup';
}

export class AddToBasketFromPopup {
  static readonly type = '[Photos] Add To Basket From Popup';
  constructor(public openedPhoto: Photo) {}
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

export class SearchPhotosByTitle {
  static readonly type = '[Photos] Search Photos By Title';
}
