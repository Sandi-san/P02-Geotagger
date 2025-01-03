import { makeAutoObservable } from 'mobx';
import { UserType } from '../models/user';
import { userStorage } from '../utils/localStorage';

//Save User object to local storage
export interface AuthContextType {
  user?: UserType | null;
  login: () => void;
  signout: () => void;
}

class AuthStore {
  user?: UserType | null = userStorage.getUser() || null;

  constructor() {
    makeAutoObservable(this);
  }
  //login user, saves access_token
  login(user: UserType) {
    userStorage.setUser(user);
    this.user = user;
  }

  //logout user, deletes access_token
  signout() {
    userStorage.clearUser();
    this.user = undefined;
  }
}

const authStore = new AuthStore();
export default authStore;
