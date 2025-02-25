import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RegisterUserFields } from '../../hooks/react-hook-form/useRegister';
import { LoginUserFields } from '../../hooks/react-hook-form/useLogin';
import { EmailUserFields } from '../../hooks/react-hook-form/useResetEmail';
import { PasswordUserFields } from '../../hooks/react-hook-form/useResetPassword';

//api for /user route in backend
export const authSlice = createApi({
  reducerPath: 'auth', //identifier for this slice
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${process.env.REACT_APP_BACKEND_DOMAIN}/auth`  
  }), //base URL (matches backend)
  endpoints: (builder) => ({
    //define enpoints as functions
    registerUser: builder.mutation<{ access_token: string }, RegisterUserFields>({
      query: (formData: RegisterUserFields) => ({
        url: '/register',
        method: 'POST',
        body: formData,
      }),
    }),
    loginUser: builder.mutation<{ access_token: string }, LoginUserFields>({
      query: (formData: LoginUserFields) => ({
        url: '/login',
        method: 'POST',
        body: formData,
      }),
    }),
    redirectOAuthUser: builder.mutation({
      query: () => ({
        url: '/google',
        method: 'GET',
        credentials: 'include', //include cookies
      }),
    }),
    loginOAuthUser: builder.mutation<{ access_token: string }, void>({
      query: () => ({
        url: '/google/redirect',
        method: 'GET',
      }),
    }),
    forgottenPassword: builder.mutation<{ response: string }, EmailUserFields>({
      query: (formData: EmailUserFields) => ({
        url: '/forgotten-password',
        method: 'POST',
        body: formData,
      }),
    }),
    resetPassword: builder.mutation<{ response: string }, PasswordUserFields>({
      query: (formData: PasswordUserFields) => ({
        url: '/reset-password',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useRedirectOAuthUserMutation,
  useLoginOAuthUserMutation,
  useForgottenPasswordMutation,
  useResetPasswordMutation,
} = authSlice;
