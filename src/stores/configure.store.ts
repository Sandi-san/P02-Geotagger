import { configureStore } from '@reduxjs/toolkit'
import registerReducer from '../slices/forms/userRegisterForm.slice'
import loginReducer from '../slices/forms/userLoginForm.slice'
import { userSlice } from '../slices/api/user.slice'
import { authSlice } from '../slices/api/auth.slice'

//Redux Store from React-Redux (override state management from regular React)
export const store = configureStore({
    //define forms
    reducer: {
        registerForm: registerReducer,
        loginForm: loginReducer,
        [authSlice.reducerPath]: authSlice.reducer,
        [userSlice.reducerPath]: userSlice.reducer,
    },
    //add middleware for caching and invalidation of apis (required)
    middleware: (getDefaultMiddelware) =>
        getDefaultMiddelware().concat(authSlice.middleware, userSlice.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store

/* USING API:
const UserDetail = ({ userId }: { userId: string }) => {
  const { data: user, error, isLoading } = useGetUserByIdQuery(userId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading user</p>;

  return (
    <div>
      <h1>{user.firstName} {user.lastName}</h1>
      <p>Email: {user.email}</p>
    </div>
  );

*/