export interface Photo {
  description: string | null;
  id: string;
  urlRegular: string;
  urlSmall: string;
  price: number;
  isSelected: boolean;
}

export interface Item {
  id: string;
  url: string;
}

export interface SearchPhotosRequest {
  term: string;
  page?: number;
  price?: number;
  color?: string;
  orientation?: string;
}
