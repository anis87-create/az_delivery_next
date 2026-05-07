import { createApi } from '@reduxjs/toolkit/query/react';
import type { IComparePasswordsCredentials, UserProfile } from '@/app/types/auth.types';
import type { LoginResponse, RegisterData, LoginCredentials, User } from '@/app/types';
import baseQuery from './api';
import { setUser, logout } from '../slices/authSlice';

export const authAPI = createApi({
  reducerPath: 'authApi',
  baseQuery,
  tagTypes: ['AuthUser'],
  endpoints: (builder) => ({

    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: LoginResponse) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.token);
        }
        return response;
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
        } catch {}
      },
      invalidatesTags: ['AuthUser'],
    }),

    register: builder.mutation<User, RegisterData>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),

    getAuthenticatedUser: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['AuthUser'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {}
      },
    }),

    updateProfile: builder.mutation<UserProfile, FormData>({
      query: (form) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: form,
      }),
      invalidatesTags: ['AuthUser'],
    }),

    updatePassword: builder.mutation<void, IComparePasswordsCredentials>({
      query: (passwordsCredentials) => ({
        url: '/auth/updatePassword',
        method: 'PUT',
        body: passwordsCredentials,
      }),
    }),

    logoutUser: builder.mutation<void, void>({
      queryFn: (_, { dispatch }) => {
        dispatch(logout());
        return { data: undefined };
      },
      invalidatesTags: ['AuthUser'],
    }),

  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetAuthenticatedUserQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useLogoutUserMutation,
} = authAPI;
