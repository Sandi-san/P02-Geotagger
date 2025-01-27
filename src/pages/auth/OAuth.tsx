//middlware page for fetching the User's access_token during OAuth login
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenStorage } from '../../utils/tokenStorage';
import userStore from '../../stores/user.store';
import fetchUser from '../../utils/fetchLocalUser';
import { UserType } from '../../models/user';

const OAuthCallback = () => {
  //TODO: DISPLAY ERROR PAGE IF LOGIN FAILED
  const navigate = useNavigate();

  useEffect(() => {
    const setLocalUser = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const accessToken = queryParams.get('access_token');
      // console.log("Token: ",accessToken)

      if (accessToken) {
        // Save the token securely (e.g., localStorage)
        tokenStorage.setToken(accessToken);

        //TODO: make this as a helper function because it often repeats
        //if User is not locally saved yet, fetch the User from DB and login
        if (!userStore.user) {
          const fetchUserResponse = await fetchUser();
          console.log('Returned user:', fetchUserResponse);
          if (typeof (fetchUserResponse as UserType) === 'object' &&
            fetchUserResponse !== undefined && fetchUserResponse !== null)
            userStore.login(fetchUserResponse)
        }

        // Redirect the user to the home page or another secure route
        navigate('/');
      } else {
        // Handle error or invalid token
        console.error('Access token is missing or invalid');
      }
    }
    setLocalUser()
  }, []);

  return <div>Processing login...</div>;
};

export default OAuthCallback;
