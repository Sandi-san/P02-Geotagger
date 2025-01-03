import authStore from '../stores/auth.store';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Navigate, RouteProps } from 'react-router-dom';

//When accessing pages while user is already logged in
const RestrictedRoute: FC<RouteProps> = ({ children }: RouteProps) => {
  //if user is logged, redirect to landing page
  if (authStore.user) {
    return <Navigate to="/" />;
  }
  return children as JSX.Element;
};

export default observer(RestrictedRoute);
