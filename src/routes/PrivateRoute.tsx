import userStore from '../stores/user.store';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Navigate, RouteProps, useLocation } from 'react-router-dom';

//When accessing pages that require logged user
const PrivateRoute: FC<RouteProps> = ({ children }: RouteProps) => {
  const location = useLocation();

  //if user is not logged, redirect to login page
  if (!userStore.user) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
      />
    );
  }

  return children as JSX.Element;
};

export default observer(PrivateRoute);
