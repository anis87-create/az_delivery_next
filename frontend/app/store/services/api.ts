import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api',
  prepareHeaders: (headers) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && typeof result.error.status === 'number') {
    const data = result.error.data as { msg?: string; message?: string } | undefined;
    const serverMessage = data?.msg ?? data?.message;
    if (serverMessage) {
      result.error = { status: result.error.status, data: { ...data, msg: serverMessage } };
    }
  }

  return result;
};

export default baseQuery;
