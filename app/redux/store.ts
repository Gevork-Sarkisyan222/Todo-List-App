import { configureStore } from '@reduxjs/toolkit';
import { listsApi } from './api/listsApi';
import taskValue from './slices/taskValue';

const store = configureStore({
  reducer: {
    [listsApi.reducerPath]: listsApi.reducer,
    taskValue,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(listsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
