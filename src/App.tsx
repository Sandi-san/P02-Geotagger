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
        console.log("User data is set: ", userStore.user ? 'true' : 'false')
        //if local token is set, but user is not set, fetch user from DB
        //if User is not locally saved yet, fetch the User from DB and login
        if (!userStore.user) {
          try {
            const fetchUserResponse = await fetchUser();
            console.log('Returned user:', fetchUserResponse);
            if (typeof (fetchUserResponse as UserType) === 'object' &&
              fetchUserResponse !== undefined && fetchUserResponse !== null)
              userStore.login(fetchUserResponse)
          } catch (error) {
            console.error('Error fetching user:', error);
          }
        }
      }
      setLoading(false); // Mark data as loaded
    };

    initLocalUser();
  }, []);

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
