import { makeAutoObservable } from 'mobx';
import { UserType } from '../models/user';
import { userStorage } from '../utils/localStorage';

//Fetch and save User object (saves latest user data)
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
  //save user
  login(user: UserType) {
    // userStorage.setUser(user);
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
