export interface Store {
  store_id: string;
  store_name: string;
  sido: string;
  region: string;
  store_type: string;
  business_type?: string;
  store_area_pyeong?: number | string;
}

export interface GetStoresResponse {
  stores: Store[];
}
