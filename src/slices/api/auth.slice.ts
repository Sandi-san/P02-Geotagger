import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RegisterUserFields } from '../../hooks/react-hook-form/useRegister';

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
    updateUser: builder.mutation({
      query: ({ id, ...user }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: user,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = authSlice;
