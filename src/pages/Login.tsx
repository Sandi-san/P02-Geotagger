import { FC, useState } from 'react';
import isApiError from '../utils/apiErrorChecker';
import useMediaQuery from '../hooks/useMediaQuery';
import { Box, Button, DialogContent, FormControl, IconButton, InputAdornment, Link, Modal, TextField, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';
import ErrorDisplay from '../components/modals/ErrorDisplay';
import theme from '../theme';
import { LoginUserFields, useLoginForm } from '../hooks/react-hook-form/useLogin';
import { useLoginOAuthUserMutation, useRedirectOAuthUserMutation, useLoginUserMutation } from '../slices/api/auth.slice';
import { tokenStorage } from '../utils/tokenStorage';
import userStore from '../stores/user.store';
import fetchUser from '../utils/fetchLocalUser';
import { UserType } from '../models/user';

const Login: FC = () => {
  //mediaQuery for Responsive Web Design
  const { isMobile } = useMediaQuery(720)
  //TODO: remove right section display when set as isMobile

  //mediaQuery for top-left logo
  const unstickLogo = useMediaQuery(850)

  //form validation for user registration (custom hook)
  const { handleSubmit, errors, control } = useLoginForm();
  //initialize mutation hook for login User (register user api call)
  const [loginUser] = useLoginUserMutation()

  //initialize mutation hook to redirect to Google OAuth page
  // const [redirectOAuthUser] = useRedirectOAuthUserMutation()
  //initialize mutation hook for login User with OAuth
  // const [loginOAuthUser] = useLoginOAuthUserMutation()

  //toggle buttons for showing values inside password form
  const [showPassword, setShowPassword] = useState(false);

  //value of error returned by api
  const [apiError, setApiError] = useState('')
  //status code returned by api
  const [apiStatus, setApiStatus] = useState('')
  //state if error has occured
  const [showError, setShowError] = useState(false)

  //handle submit method: login (with Yup form validation)
  const onSubmit = async (formData: LoginUserFields) => {
    // console.log('Form Data:', formData);

    try {
      //call RTK Query mutation with valid formData (login user)
      const loginResponse = await loginUser(formData).unwrap();
      console.log('User registered successfully:', loginResponse);

      //save the returned access_token into local storage
      tokenStorage.setToken(loginResponse.access_token)
      console.log('Local user:', tokenStorage.getToken());

      //if User is not locally saved yet, fetch the User from DB and login
      if (!userStore.user) {
        const fetchUserResponse = await fetchUser();
        console.log('Returned user:', fetchUserResponse);
        if (typeof (fetchUserResponse as UserType) === 'object' &&
          fetchUserResponse !== undefined && fetchUserResponse !== null)
          userStore.login(fetchUserResponse)
      }
    }
    catch (err) {
      console.error("Error during login: ", err)
      if (isApiError(err)) {
        setApiError(err.data.message);
        setApiStatus(err.status.toString());
        setShowError(true);
      }
      else {
        //check if thrown error is a FETCH_ERROR
        if (typeof err === 'object' && (err !== undefined || null)
          && 'status' in (err as any) && 'error' in (err as any)) {
          setApiStatus((err as any).status);
          setApiError((err as any).error);
        }
        else
          setApiError("An unexpected error has occured.");
        setShowError(true);
      }
    }
  }

  const handleOAuthLogin = async () => {
    try {
      window.location.href = `${process.env.REACT_APP_BACKEND_DOMAIN}/auth/google`
    } catch (error) {
      console.error('Error during Google OAuth login:', error);
      setApiError("Error during Google OAuth login.");
      setShowError(true);
    }
  };

  //Show/hide password visibility
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <>
      <Box sx={{
        position: 'relative',
        display: 'flex',
        height: '100vh',
        width: '100%',
        flexDirection: 'row',
        textAlign: 'center',
        alignItems: 'stretch',
        overflow: 'hidden', //prevent accidental overflow
      }}>
        <Box
          sx={{
            flex: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            //change style based on width of the visible page (mediaQuery)
            justifyContent: isMobile ? 'flex-start' : 'center',
            alignItems: 'center',
            bgcolor: 'background.paper',
            paddingX: isMobile ? 0 : 8,
            minHeight: 0,
            overflow: 'auto',
          }}
        >
          {/* Top left logo with functionality and RWD */}
          <Box
            sx={{
              position: unstickLogo.isMobile ? 'static' : 'absolute',
              top: isMobile ? 'auto' : '2vh',
              left: isMobile ? 'auto' : '4vh',
              display: 'flex',
              alignItems: 'center',
              // width: '100%',
              margin: isMobile ? 2 : 0,
              justifyContent: isMobile ? 'center' : 'flex-start',
              gap: 1,
            }}
          >
            {/* Logo */}
            <Link href="/">
              <Box component="img" src="/logo.svg" alt="Logo" sx={{ height: 40 }} />
            </Link>
            {/* Text */}
            <Typography variant="h4" component="span" sx={{ alignItems: 'center' }}>
              <span style={{ color: theme.palette.primary.main }}>Geo</span>
              <span style={{ color: theme.palette.primary.dark }}>tagger</span>
            </Typography>
          </Box>

          <Typography variant="h3" gutterBottom>
            Sign in
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="body1" color='primary.dark' sx={{ marginBottom: 2 }} >
              Welcome back to Geotagger. We're glad to see you back.
            </Typography>
            <FormControl fullWidth>
              {/* Email */}
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                )}
              />
              {/* Password */}
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: 2 }}
                    // Eye icon for toggling visiblity
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={togglePasswordVisibility}
                              edge="end"
                            >
                              <Box component="img" src="/eye.svg" alt="Icon" sx={{ height: '2vh' }} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginBottom: 2 }}
              >
                Sign in
              </Button>
              <Button
                onClick={handleOAuthLogin}
                variant="contained"
                fullWidth
                sx={{
                  marginBottom: 2,
                  backgroundColor: 'white',
                  color: 'primary.dark',
                  border: 1,
                  borderColor: 'darkgray',
                }}
              >
                <Box component="img" src="/social-google.svg" alt="" sx={{ height: 16, marginRight: 1 }} />
                Sign in with Google
              </Button>
            </FormControl>
          </form>
          {/* Unsupported */}
          {/* <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginBottom: 2 }}
              >
                Sign in with Facebook
              </Button> */}
          <Box sx={{
            width: '100%',
            position: 'relative',
            display: 'flex',
            textAlign: 'center',
            justifyContent: 'space-between',
            // minHeight: 0,
            maxWidth: isMobile ? '100vh' : '60vh',
          }}>
            <Box sx={{ alignItems: 'flex-start', textAlign: 'left' }}>
              <Typography variant="body1" color='primary.dark'>
                Do you want to create an account?
              </Typography>
            </Box>
            <Box sx={{ alignContent: 'flex-end', textAlign: 'end' }} >
              <Link variant="body1" color='primary.main'
                sx={{ textDecoration: 'none' }}
                href="/register"
              >
                Sign up
              </Link>
            </Box>
          </Box>
          {/* If api error occurs, show error widget  */}
          {/* {showError && (
            <ErrorDisplay message={apiError} />
          )} */}
          {showError && (
            <Modal
              open={showError} // Modal visibility tied to the showError state
              onClose={() => setShowError(false)} // Close the modal on backdrop click
              aria-labelledby="error-modal-title"
              aria-describedby="error-modal-description"
            >
              <DialogContent>
                <ErrorDisplay message={apiError} errorStatus={apiStatus} handleClose={() => setShowError(false)} />
              </DialogContent>
            </Modal>
          )}
          {/* {isLoading && (
                        <Typography color='info'>Registering...</Typography>
                    )}*/}
        </Box>
        <Box
          sx={{
            position: 'relative',
            flex: 3,
            height: '100vh', //stretch through entire height
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'primary.main'
          }}
        >
          {/* Image background */}
          <Box
            component="img"
            src='background-map.png'
            alt="No image"
            sx={{
              width: '100%',
              height: '100vh',
              objectFit: 'cover',
              borderRadius: 'inherit',

            }}
          />
          {/* Green overlay */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100vh',
              //gradient from left to right: color from custom theme with alpha channel (50% = 80 in hex color code)
              background: `linear-gradient(to right, ${theme.palette.primary.main}80, ${theme.palette.primary.light}80)`,
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Logo */}
            <Box component="img" src="/logo-outline.svg" alt="Lock" sx={{ height: 200, position: 'relative' }} />
          </Box>
        </Box>
      </Box >
    </>
  );
};

export default Login;