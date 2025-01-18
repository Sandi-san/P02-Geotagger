import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RegisterUserFields } from '../../hooks/react-hook-form/useRegister';
import { LoginUserFields } from '../../hooks/react-hook-form/useLogin';

//api for /user route in backend
export const authSlice = createApi({
  reducerPath: 'auth', //identifier for this slice
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/auth' }), //base URL (matches backend)
  endpoints: (builder) => ({
    //define enpoints as functions
    registerUser: builder.mutation({
      query: (user: RegisterUserFields) => ({
        url: '/register',
        method: 'POST',
        body: user,
      }),
    }),
    loginUser: builder.mutation({
      query: (user: LoginUserFields) => ({
        url: '/login',
        method: 'POST',
        body: user,
      }),
    }),
    redirectOAuthUser: builder.mutation({
      query: () => ({
        url: '/google',
        method: 'GET',
        credentials: 'include', // Include cookies if needed
      }),
    }),
    loginOAuthUser: builder.mutation<{ access_token: string }, void>({
      query: () => ({
        url: '/google/redirect',
        method: 'GET',
        // credentials: 'include', // Include cookies if needed
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useRedirectOAuthUserMutation,
  useLoginOAuthUserMutation,
} = authSlice;
