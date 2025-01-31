//Structure for passing Location
export type LocationType = {
  id: number;
  image?: string;
  lat: number;
  lon: number;
  address?: string;
  userId: number;
};
export type FetchPaginatedLocationType = {
  data: {
    id: number;
    image?: string;
    lat: number;
    lon: number;
    address?: string;
    userId: number;
  }[],
  meta: {
    last_page: number,
    total: number,
    page: number,
  }
}
