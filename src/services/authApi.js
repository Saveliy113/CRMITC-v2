import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://165.22.49.123:5000/api' }),
  reducerPath: 'authApi',
  endpoints: (build) => ({
    logIn: build.mutation({
      query: (body) => ({
        url: '/auth/token/login/',
        method: 'POST',
        body,
      }),
    }),
    logOut: build.mutation({
      query: (token) => ({
        url: '/auth/token/logout/',
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
    }),
  }),
});

export const { useLogInMutation, useLogOutMutation } = authApi;
