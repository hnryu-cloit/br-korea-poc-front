export interface Store {
  store_id: string;
  store_name: string;
  sido: string;
  region: string;
  store_type: string;
}

export interface GetStoresResponse {
  stores: Store[];
}