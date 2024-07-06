import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const listsApi = createApi({
  reducerPath: 'listsApi',
  tagTypes: ['Lists'],
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/' }),
  endpoints: (builder) => ({
    getLists: builder.query({
      query: () => '/lists',
      providesTags: ({ results }) =>
        results
          ? [
              ...results.map(({ id }: { id: string }) => ({
                type: 'Lists',
                id,
              })),
              { type: 'Lists', id: 'LIST' },
            ]
          : [{ type: 'Lists', id: 'LIST' }],
    }),
    addList: builder.mutation({
      query: (obj) => ({
        url: '/lists/',
        method: 'POST',
        body: JSON.stringify(obj),
      }),
      invalidatesTags: [{ type: 'Lists', id: 'LIST' }],
    }),
    removeList: builder.mutation({
      query: (id) => ({
        url: `/lists/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Lists', id: 'LIST' }],
    }),
    changeListTitle: builder.mutation({
      query: ({ id, newTitle }) => ({
        url: `lists/${id}`,
        method: 'PATCH',
        body: JSON.stringify({ title: newTitle }),
      }),
      invalidatesTags: [{ type: 'Lists', id: 'LIST' }],
    }),

    // tasks work
    addTask: builder.mutation({
      query: ({ listId, createdTask }) => ({
        url: `lists/${listId}`,
        method: 'PATCH',
        body: {
          tasks: createdTask,
        },
      }),
      invalidatesTags: [{ type: 'Lists', id: 'LIST' }],
    }),
    remvoeTask: builder.mutation({
      query: ({ listId, deletedTask }) => ({
        url: `/lists/${listId}`,
        method: 'PATCH',
        body: {
          tasks: deletedTask,
        },
      }),
      invalidatesTags: [{ type: 'Lists', id: 'LIST' }],
    }),
    makeCompleted: builder.mutation({
      query: ({ listId, checkedTask }) => ({
        url: `/lists/${listId}`,
        method: 'PATCH',
        body: {
          tasks: checkedTask,
        },
      }),
      invalidatesTags: [{ type: 'Lists', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetListsQuery,
  useAddListMutation,
  useRemoveListMutation,
  useChangeListTitleMutation,
  useAddTaskMutation,
  useRemvoeTaskMutation,
  useMakeCompletedMutation,
} = listsApi;
