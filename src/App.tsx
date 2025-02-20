import { FC, useEffect, useState } from 'react';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import Routes from './routes/Routes';
import { usePageIdentification } from './hooks/usePageIdentification';
import { tokenStorage } from './utils/tokenStorage';
import userStore from './stores/user.store';
import fetchUser from './utils/fetchLocalUser';
import { UserType } from './models/user';
import Loading from './components/ui/Loading';
import useActivityLogger from './hooks/useActivityLogger';

//Main App page, prepare theme, run routes
const App: FC = () => {
  //change tab header name based on specific page
  usePageIdentification();

  const [loading, setLoading] = useState(true);

  //Important: Load User data in App, because it is run before Home & Header
  //order: App->Home->Layout->Header->HomeLogged
  useEffect(() => {
    //async function that executes first then loads the page
    const initLocalUser = async () => {
      if (!tokenStorage.isTokenValid()) {
        if (tokenStorage.getToken() != null) {
          console.error(`Token '${tokenStorage.getToken()}' is invalid. Signing out.`)
          userStore.signout();
        }
      }
      else {
        // console.log("User data is set: ", userStore.user ? 'true' : 'false')
        //if local token is set, but user is not set, fetch user from DB
        //(code copied from loginUser.ts, just calling the method refuses the user to access ActivityLog) 
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
      setLoading(false); //mark data as loaded
    };

    initLocalUser();
  }, []);


  //use User Logger
  useActivityLogger()

  if (loading) {
    //Show loading widget
    return <Loading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Routes />
    </ThemeProvider>
  );
}

export default App;
