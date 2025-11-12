// src/store/api/adminApi.ts
import { Player } from '@/lib/types/admin.types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Create an API slice
export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/admin' }),
  endpoints: (builder) => ({
    getUsers: builder.query<Player[], void>({
      query: () => '/users', // GET /api/admin/users
    }),
  }),
});

// Export the auto-generated hook for components
export const { useGetUsersQuery } = adminApi;

