import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserType } from '../../models/user';
import { RootState } from '../../stores/configure.store';
import { tokenStorage } from '../../utils/tokenStorage';
import { UpdateUserFields } from '../../hooks/react-hook-form/useCreateUpdateUser';

//api for /user route in backend 
export const userSlice = createApi({
  reducerPath: 'user', //identifier for this slice
  baseQuery: fetchBaseQuery({
    //base URL (matches backend)
    baseUrl: `${process.env.REACT_APP_BACKEND_DOMAIN}/user`,
    prepareHeaders: (headers) => {
      //retrieve user access_token from local storage 
      const token = tokenStorage.getToken()
      if (token)
        headers.set('Authorization', `Bearer ${token}`)
      return headers
    }
  }),
  endpoints: (builder) => ({
    getUser: builder.query<UserType, void>({
      query: () => ({
        url: '',
        method: 'GET',
      }),
      //map the response of the API to a specific defined class
      transformResponse: (response: any): UserType => {
        return {
          id: response.id,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          image: response.image,
          guessTokens: response.guessTokens,
        }
      }
    }),
    updateUser: builder.mutation<UserType, UpdateUserFields>({
      query: (formData: UpdateUserFields) => ({
        url: '/update',
        method: 'PATCH',
        body: formData,
      }),
      transformResponse: (response: any): UserType => {
        return {
          id: response.id,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          image: response.image,
          guessTokens: response.guessTokens,
        }
      }
    }),
    updateUserPassword: builder.mutation<{response: string}, UpdateUserFields>({
      query: (formData: UpdateUserFields) => ({
        url: '/update-password',
        method: 'PATCH',
        body: formData,
      }),
    }),
    uploadImage: builder.mutation<UserType, FormData>({
      query: (formData) => ({
        url: '/update-image',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: any): UserType => {
        return {
          id: response.id,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          image: response.image,
          guessTokens: response.guessTokens,
        }
      }
    }),
    //define enpoints as functions (TODO)
    // getUsers: builder.query({
    //   query: () => '/users', //endpoint to fetch users
    // }),
    // getUserById: builder.query({
    //   query: (id: string) => `/users/${id}`, // Endpoint to fetch a user by ID
    // }),
    // createUser: builder.mutation({
    //   query: (user) => ({
    //     url: '/users',
    //     method: 'POST',
    //     body: user,
    //   }),
    // }),
    // updateUser: builder.mutation({
    //   query: ({ id, ...user }) => ({
    //     url: `/users/${id}`,
    //     method: 'PUT',
    //     body: user,
    //   }),
    // }),
    // deleteUser: builder.mutation({
    //   query: (id) => ({
    //     url: `/users/${id}`,
    //     method: 'DELETE',
    //   }),
    // }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useUpdateUserPasswordMutation,
  useUploadImageMutation,
  // useGetUsersQuery,
  // useGetUserByIdQuery,
  // useCreateUserMutation,
  // useUpdateUserMutation,
  // useDeleteUserMutation,
} = userSlice;
