import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenStorage } from '../../utils/tokenStorage';
import { Box, Typography } from '@mui/material';
import saveLocalUser from '../../utils/loginUser';
import { routes } from '../../constants/routesConstants';

//middlware page for fetching the User's access_token during OAuth login
const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const setLocalUser = async () => {
      //parse access token from current url 
      const queryParams = new URLSearchParams(window.location.search);
      const accessToken = queryParams.get('access_token');
      // console.log("Token: ",accessToken)

      if (accessToken) {
        //save the token securely in localStorage
        tokenStorage.setToken(accessToken);

        saveLocalUser()

        //redirect the user to the home page
        navigate(routes.HOME);
      } else {
        console.error('Access token is missing or invalid');
      }
    }
    setLocalUser()
  }, []);

  //basic design
  return (
    <Box sx={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', height: '100vh' }}>
      <Typography variant='h3'>Processing login...</Typography>
    </Box>);
};

export default OAuthCallback;
