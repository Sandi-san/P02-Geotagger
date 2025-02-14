import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

//define custom titles for each accessible url of the app
const onDefault = () => {
  document.title = 'Geotagger';
  document.body.id = '';
};
const onHome = () => {
  document.title = 'Geotagger';
  document.body.id = 'home-page';
};

const onLogin = () => {
  document.title = 'Geotagger - Login';
  document.body.id = 'login-page';
};
const onSignup = () => {
  document.title = 'Geotagger - Sign up';
  document.body.id = 'signup-page';
};
const onResetPassword = () => {
  document.title = 'Geotagger - Reset password';
  document.body.id = 'resetPassword-page';
};
const onActivityLog = () => {
  document.title = 'Geotagger - Activity log';
  document.body.id = 'activityLog-page';
};
const onLocationAdd = () => {
  document.title = 'Geotagger - Add location';
  document.body.id = 'locationAdd-page';
};
const onLocation = () => {
  document.title = 'Geotagger - Location';
  document.body.id = 'location-page';
};
const onProfile = () => {
  document.title = 'Geotagger - Profile';
  document.body.id = 'profile-page';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const callbacks: any = {
  '/': [onHome],
  '/login': [onLogin],
  '/register': [onSignup],
  '/forgotten-password': [onResetPassword],
  '/reset-password': [onResetPassword],
  '/activity-log': [onActivityLog],
  '/location/add': [onLocationAdd],
  '/location': [onLocation],
  '/profile': [onProfile],
  '*': [onDefault],
};

export const addPageIdentification = (_case: string, fn: () => void) => {
  callbacks[_case] = callbacks[_case] || [];
  callbacks[_case].push(fn);
};

export const usePageIdentification = () => {
  const location = useLocation();

  const customSwitch = (value: string) => {
    //exact match
    if (callbacks[value]) {
      callbacks[value].forEach((fn: () => void) => {
        fn();
      });
    }
    //like match (for all location pages)
    else if (value.startsWith('/location/')){
      onLocation()
    }
    else {
      onDefault();
    }
  };

  useEffect(() => {
    if (location.pathname) customSwitch(location.pathname);
  }, [location.pathname]);
};
