import { makeAutoObservable } from 'mobx';
import { UserType } from '../models/user';
import { tokenStorage } from '../utils/tokenStorage';

//Fetch and save User object (saves latest user data)
export interface UserContextType {
  user?: UserType | null;
  login: () => void;
  signout: () => void;
}

class UserStore {
  user?: UserType | null;

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
    tokenStorage.clearToken();
    this.user = undefined;
  }
}

const userStore = new UserStore();
export default userStore;
