import { Item, Photo } from '../models/photo.model';

export class SetFilters {
  static readonly type = '[Filters] Set Filters';
}

export class GetPhotos {
  static readonly type = '[Photos] Get Photos';
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

export class AddPhotoToBasket {
  static readonly type = '[Basket] Add Photo To Basket';
  constructor(public photo: Photo) {}
}

export class ShowSettingsPopup {
  static readonly type = '[Filters] Show Settings Popup';
}

export class ChangeColorFilter {
  static readonly type = '[Filters] Change Color Filter';
  constructor(public color: string) {}
}

export class ChangeOrientationFilter {
  static readonly type = '[Filters] Change Orientation Filter';
  constructor(public orientation: string) {}
}

export class SetInitCost {
  static readonly type = '[Cost] Set Init Cost';
}

export class RemovePhotoFromBasket {
  static readonly type = '[Basket] Remove Photo From Basket';
  constructor(public id: string) {}
}

export class SubmitPromo {
  static readonly type = '[Promo] Submit Promo';
  constructor(public promo: string) {}
}

export class InitializePurchasingState {
  static readonly type = '[Purchase] Initialize Purchasing State';
}

export class GetPurchaseStatus {
  static readonly type = '[Purchase] Get Purchase Status';
}

export class MakeOrder {
  static readonly type = '[Order] Make Order';
  constructor(public items: Item[], public promo: string, public cost: number) {}
}

export class FinishPurchasing {
  static readonly type = '[Purchase] Finish Purchasing';
}
