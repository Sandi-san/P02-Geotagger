import { FC, lazy, Suspense } from 'react';
import { Route, RouteProps, Routes as Switch } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import RestrictedRoute from './RestrictedRoute';
import Loading from '../components/ui/Loading';

export enum RouteType {
  PUBLIC,
  PRIVATE,
  RESTRICTED,
}

type AppRoute = RouteProps & {
  type?: RouteType;
};

// Public routes
const Home = lazy(() => import('../pages/Home'));

// Private routes
const Profile = lazy(() => import('../pages/user/Profile'));
const LocationAdd = lazy(() => import('../pages/location/LocationAdd'));
const LocationEditWrapper = lazy(() => import('../pages/location/LocationEditWrapper'));
const LocationWrapper = lazy(() => import('../pages/location/LocationWrapper'));
const ActivityLog = lazy(() => import('../pages/admin/ActivityLog'));

// Restricted routes
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgottenPassword = lazy(() => import('../pages/auth/ForgottenPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const OAuthCallback = lazy(() => import('../pages/auth/OAuth'));

// Error routes
const Page404 = lazy(() => import('../pages/Page404'));

export const AppRoutes: AppRoute[] = [
  // Restricted Routes
  {
    type: RouteType.RESTRICTED,
    path: '/login',
    children: <Login />,
  },
  {
    type: RouteType.RESTRICTED,
    path: '/register',
    children: <Register />,
  },
  {
    type: RouteType.RESTRICTED,
    path: '/forgotten-password',
    children: <ForgottenPassword />,
  },
  {
    type: RouteType.RESTRICTED,
    path: '/reset-password',
    children: <ResetPassword />,
  },
  //route for parsing OAuth User data
  {
    type: RouteType.RESTRICTED,
    path: '/oauth/callback',
    children: <OAuthCallback />,
  },

  // Private Routes
  {
    type: RouteType.PRIVATE,
    path: '/profile',
    children: <Profile />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/location/add',
    children: <LocationAdd />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/location/edit/:id',
    children: <LocationEditWrapper />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/location/:id',
    children: <LocationWrapper />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/activity-log',
    children: <ActivityLog />,
  },

  // Public Routes
  {
    type: RouteType.PUBLIC,
    path: '/',
    children: <Home />,
  },

  // 404 Error
  {
    type: RouteType.PUBLIC,
    path: '*',
    children: <Page404 />,
  },
  //url for testing style of Loading widget
  // {
  //   type: RouteType.PUBLIC,
  //   path: '/loading-test',
  //   children: <Loading />,
  // },
];

const Routes: FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        {AppRoutes.map((r) => {
          const { type } = r;
          if (type === RouteType.PRIVATE) {
            return (
              <Route
                key={`${r.path}`}
                path={`${r.path}`}
                element={<PrivateRoute>{r.children}</PrivateRoute>}
              />
            );
          }
          if (type === RouteType.RESTRICTED) {
            return (
              <Route
                key={`${r.path}`}
                path={`${r.path}`}
                element={<RestrictedRoute>{r.children}</RestrictedRoute>}
              />
            );
          }

          return (
            <Route key={`${r.path}`} path={`${r.path}`} element={r.children} />
          );
        })}
        <Route path="*" element={<Page404 />} />
      </Switch>
    </Suspense>
  );
};

export default Routes;
