import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserType } from '../../models/user';
import { RootState } from '../../stores/configure.store';
import { tokenStorage } from '../../utils/tokenStorage';
import { UpdateUserFields } from '../../hooks/react-hook-form/useCreateUpdateUser';
import { FetchPaginatedLocationType, LocationType } from '../../models/location';
import { FetchGuessType, FetchPaginatedGuessType, GuessType } from '../../models/guess';
import { FetchActionType } from '../../models/action';

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
          role: response.role,
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
    updateUserPassword: builder.mutation<{ response: string }, UpdateUserFields>({
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
    getLocations: builder.query<FetchPaginatedLocationType, { page: number, take?: number }>({
      query: ({ page, take }) => {
        //construct query parameters dynamically
        const params = new URLSearchParams({ page: page.toString() });
        //if take is passed, append as parameter
        if (take !== undefined) {
          params.append('take', take.toString());
        }
        //call route with arguments
        return {
          url: `/locations?${params.toString()}`,
          method: 'GET',
        };
      },
    }),
    getGuesses: builder.query<FetchPaginatedGuessType, { page: number, take?: number }>({
      query: ({ page, take }) => {
        const params = new URLSearchParams({ page: page.toString() });

        if (take !== undefined) {
          params.append('take', take.toString());
        }

        return {
          url: `/guesses?${params.toString()}`,
          method: 'GET',
        };
      },
    }),
    getActions: builder.query<FetchActionType[], void>({
      query: () => ({
        url: '/actions',
        method: 'GET',
      }),
    })
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useUpdateUserPasswordMutation,
  useUploadImageMutation,
  useGetLocationsQuery,
  useGetGuessesQuery,
  useGetActionsQuery,
} = userSlice;
