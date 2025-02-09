import { UserType } from "./user";

//Structure for passing User Action
export type ActionType = {
    id?: number;
    
  };
  //Structure for fetching User Action
  export type FetchActionType = {
    id: number;
    createdAt?: Date;
    action?: string;
    type?: string;
    newValue?: number;
    url?: string;
    user?: UserType;
  };