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
//TODO: ADD PAGES
const Home = lazy(() => import('../pages/Home'));
// const Auction = lazy(() => import('../pages/Auction'));
// const Auctions = lazy(() => import('../pages/Auctions'));

// Private routes
//TODO: ADD PAGES (EG. PROFILE)
const Profile = lazy(() => import('../pages/Profile'));

// Restricted routes
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Password = lazy(() => import('../pages/Password'));
const OAuthCallback = lazy(() => import('../pages/OAuth'));

// Error routes
const Page404 = lazy(() => import('../pages/Page404'));

//TODO: add new pages below as: type, path (/auction), link

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
  //TODO
  {
    type: RouteType.RESTRICTED,
    path: '/forgot_password',
    children: <Password />,
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
  //TODO: DELETE IN PRODUCTION
  {
    type: RouteType.PUBLIC,
    path: '/loading-test',
    children: <Loading />,
  },
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
