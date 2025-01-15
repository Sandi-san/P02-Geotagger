import { UserType } from '../models/user';

const user_prefix = 'access_token';

//Save access_token into user storage (saves only access_token)
const userStorage = {
  //get user from access_token
  getUser: (): UserType => {
    if (typeof window === 'undefined') return {} as UserType;
    return JSON.parse(
      window.localStorage.getItem(`${user_prefix}`) as string,
    ) as UserType;
  },
  //get access_token
  getToken: (): string => {
    if (typeof window === 'undefined') return '';
    return JSON.parse(
      window.localStorage.getItem(`${user_prefix}`) as string,
    );
  },
  //set access_token with expiry
  setUser: (user: UserType): void => {
    window.localStorage.setItem(`${user_prefix}`, JSON.stringify(user));
  },
  //clear access_token
  clearUser: (): void => {
    window.localStorage.removeItem(`${user_prefix}`);
  },
  //set token for explicit period of time
  // setTokenExpiration: (token: string, durationInMs: number) => {
  //   const expirationTime = Date.now() + durationInMs
  //   const tokenData = {token, expirationTime}
  //   window.localStorage.setItem(`${user_prefix}`,JSON.stringify(tokenData))
  // },
};

export { userStorage };
