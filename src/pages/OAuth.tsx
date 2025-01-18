//middlware page for fetching the User's access_token during OAuth login
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenStorage } from '../utils/tokenStorage';

const OAuthCallback = () => {
    //TODO: DISPLAY ERROR PAGE IF LOGIN FAILED
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get('access_token');
    // console.log("Token: ",accessToken)

    if (accessToken) {
      // Save the token securely (e.g., localStorage)
      tokenStorage.setToken(accessToken);

      // Redirect the user to the home page or another secure route
      navigate('/');
    } else {
      // Handle error or invalid token
      console.error('Access token is missing or invalid');
    }
  }, [navigate]);

  return <div>Processing login...</div>;
};

export default OAuthCallback;
