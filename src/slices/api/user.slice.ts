import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserType } from '../../models/user';
import { RootState } from '../../stores/configure.store';
import { tokenStorage } from '../../utils/tokenStorage';

//api for /user route in backend 
export const userSlice = createApi({
  reducerPath: 'user', //identifier for this slice
  baseQuery: fetchBaseQuery({
    //base URL (matches backend) (TODO: use .env)
    baseUrl: 'http://localhost:8080/user',
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
      })
    }),
    uploadImage: builder.mutation<UserType, FormData>({
      query: (formData) => ({
        url: '/update-image',
        method: 'POST',
        body: formData,
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
  useUploadImageMutation,
  // useGetUsersQuery,
  // useGetUserByIdQuery,
  // useCreateUserMutation,
  // useUpdateUserMutation,
  // useDeleteUserMutation,
} = userSlice;
