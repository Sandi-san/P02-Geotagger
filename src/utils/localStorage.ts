import { UserType } from '../models/user';

const user_prefix = 'access_token';

//Save access_token into user storage
const userStorage = {
  //get user from access_token
  getUser: (): UserType => {
    if (typeof window === 'undefined') return {} as UserType;
    return JSON.parse(
      window.localStorage.getItem(`${user_prefix}`) as string,
    ) as UserType;
  },
  //set access_token
  setUser: (user: UserType): void => {
    window.localStorage.setItem(`${user_prefix}`, JSON.stringify(user));
  },
  //clear access_token
  clearUser: (): void => {
    window.localStorage.removeItem(`${user_prefix}`);
  },
};

export { userStorage };
