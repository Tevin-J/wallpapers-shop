export interface Filters {
  searchTerm?: string;
  price?: number;
  color?: string;
  orientation?: string;
}

export interface Params {
  term?: string;
  price?: number;
  color?: string;
  orientation?: string;
  page: number;
}
