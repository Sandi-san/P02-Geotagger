import store from '../stores/configure.store';
import { userSlice } from '../slices/api/user.slice';
import { UserType } from '../models/user';

//helper function that returns User from DB using 'access_token' in local storage
const fetchUser = async (): Promise<UserType | null> => {
  try {
    //dispatch the getUser endpoint, returns a User object
    const response = await store.dispatch(userSlice.endpoints.getUser.initiate()).unwrap();
    // console.log('Fetched user data:', response);
    return response;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

export default fetchUser;
