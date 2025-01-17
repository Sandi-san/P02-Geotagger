import { jwtDecode, JwtPayload } from 'jwt-decode';
import { UserType } from '../models/user';

const user_prefix = 'access_token';

//Save access_token into user storage (saves only access_token)
const tokenStorage = {
  //get user from access_token - DELETE
  // getUser: (): UserType => {
  //   if (typeof window === 'undefined') return {} as UserType;
  //   return JSON.parse(
  //     window.localStorage.getItem(`${user_prefix}`) as string,
  //   ) as UserType;
  // },
  //get access_token
  getToken: (): string => {
    if (typeof window === 'undefined') return '';
    return JSON.parse(
      window.localStorage.getItem(`${user_prefix}`) as string,
    );
  },
  //set access_token
  setToken: (token: string): void => {
    window.localStorage.setItem(`${user_prefix}`, JSON.stringify(token));
  },
  //clear access_token
  clearToken: (): void => {
    window.localStorage.removeItem(`${user_prefix}`);
  },
  isTokenValid: (): boolean => {
    try {
      const token = window.localStorage.getItem(`${user_prefix}`) as string
      if (!token) {
        console.warn('No saved token found. Please login.')
        return false
      }
      const decoded = jwtDecode<JwtPayload>(token)
      if (decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000)
        return decoded.exp > currentTime
      }
      return false
    }
    catch (error) {
      console.error('Error decoding token: ', error)
      return false
    }
  },
  //set token for explicit period of time
  // setTokenExpiration: (token: string, durationInMs: number) => {
  //   const expirationTime = Date.now() + durationInMs
  //   const tokenData = {token, expirationTime}
  //   window.localStorage.setItem(`${user_prefix}`,JSON.stringify(tokenData))
  // },
};

export { tokenStorage };

