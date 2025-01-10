import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

//api for /user route in backend 
export const userSlice = createApi({
  reducerPath: 'user', //identifier for this slice
  baseQuery: fetchBaseQuery({ baseUrl: '/user' }), //base URL (matches backend)
  endpoints: (builder) => ({
    //define enpoints as functions (TODO)
    getUsers: builder.query({
      query: () => '/users', //endpoint to fetch users
    }),
    getUserById: builder.query({
      query: (id: string) => `/users/${id}`, // Endpoint to fetch a user by ID
    }),
    createUser: builder.mutation({
      query: (user) => ({
        url: '/users',
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
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userSlice;
