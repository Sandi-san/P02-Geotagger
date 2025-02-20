import { UserType } from "../models/user";
import userStore from "../stores/user.store";
import fetchUser from "./fetchLocalUser";

//logs the user object locally using local access token 
const saveLocalUser = async (): Promise<void> => {
    //if User is not locally saved yet, fetch the User from DB and login
    if (!userStore.user) {
        try {
            const fetchUserResponse = await fetchUser();
            // console.log('Returned user:', fetchUserResponse);
            if (typeof (fetchUserResponse as UserType) === 'object' &&
                fetchUserResponse !== undefined && fetchUserResponse !== null)
                userStore.login(fetchUserResponse)
            else if (fetchUserResponse === null) {
                console.error('Error fetching user. User data is null.');
                userStore.signout()
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            userStore.signout()
        }
    }
}
export default saveLocalUser