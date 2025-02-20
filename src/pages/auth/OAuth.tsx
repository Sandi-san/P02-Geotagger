//middlware page for fetching the User's access_token during OAuth login
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenStorage } from '../../utils/tokenStorage';
import userStore from '../../stores/user.store';
import fetchUser from '../../utils/fetchLocalUser';
import { UserType } from '../../models/user';
import { Box, Typography } from '@mui/material';
import saveLocalUser from '../../utils/loginUser';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const setLocalUser = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const accessToken = queryParams.get('access_token');
      // console.log("Token: ",accessToken)

      if (accessToken) {
        // Save the token securely (e.g., localStorage)
        tokenStorage.setToken(accessToken);

        saveLocalUser()

        // Redirect the user to the home page or another secure route
        navigate('/');
      } else {
        // Handle error or invalid token
        console.error('Access token is missing or invalid');
      }
    }
    setLocalUser()
  }, []);

  return (
    <Box sx={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', height: '100vh' }}>
      <Typography variant='h3'>Processing login...</Typography>
    </Box>);
};

export default OAuthCallback;
