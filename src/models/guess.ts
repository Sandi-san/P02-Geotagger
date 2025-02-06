import { LocationType } from "./location";
import { UserType } from "./user";

//Structure for passing Guess
export type GuessType = {
  id: number;
  lat: number;
  lon: number;
  locationId: number;
  userId: number;
};
//Structure for receiving Guess
export type FetchGuessType = {
  id: number;
  errorDistance: number,
  createdAt?: Date,
  location: LocationType,
  user: UserType,
};
//Structure for receiving Guess array
export type FetchPaginatedGuessType = {
  data: {
    id: number;
    errorDistance: number,
    location: LocationType,
    user: UserType,
  }[],
  meta: {
    last_page: number,
    total: number,
    page: number,
  }
};
