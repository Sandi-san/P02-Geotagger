import { configureStore } from '@reduxjs/toolkit'
import registerReducer from '../slices/forms/userRegisterForm.slice'
import loginReducer from '../slices/forms/userLoginForm.slice'
import { userSlice } from '../slices/api/user.slice'
import { authSlice } from '../slices/api/auth.slice'
import { locationSlice } from '../slices/api/location.slice'

//Redux Store from React-Redux (override state management from regular React)
export const store = configureStore({
    //define forms
    reducer: {
        registerForm: registerReducer,
        loginForm: loginReducer,
        [authSlice.reducerPath]: authSlice.reducer,
        [userSlice.reducerPath]: userSlice.reducer,
        [locationSlice.reducerPath]: locationSlice.reducer,
    },
    //add middleware for caching and invalidation of apis (required)
    middleware: (getDefaultMiddelware) =>
        getDefaultMiddelware().concat(
          authSlice.middleware, 
          userSlice.middleware,
          locationSlice.middleware,
        )
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store