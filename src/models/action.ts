import { UserType } from "./user";

//Structure for passing User Action
export type ActionType = {
    action: string;
    type: string;
    newValue?: string | null;
    url: string;
    timestamp: string; //later converted to date
};
export type ActionsArrayType = {
    action: ActionType[]
}

//Structure for fetching User Action
export type FetchActionType = {
    id: number;
    createdAt?: Date;
    action?: string;
    type?: string;
    newValue?: string;
    url?: string;
    user?: UserType;
};