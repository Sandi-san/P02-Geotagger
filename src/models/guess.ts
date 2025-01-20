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
  locationImage: string,
  locationId: number;
  userId: number;
};
