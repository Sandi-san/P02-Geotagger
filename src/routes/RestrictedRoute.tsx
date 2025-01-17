import userStore from '../stores/user.store';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Navigate, RouteProps } from 'react-router-dom';

//When accessing pages while user is already logged in
const RestrictedRoute: FC<RouteProps> = ({ children }: RouteProps) => {
  //if user is logged, redirect to landing page
  if (userStore.user) {
    return <Navigate to="/" />;
  }
  return children as JSX.Element;
};

export default observer(RestrictedRoute);
