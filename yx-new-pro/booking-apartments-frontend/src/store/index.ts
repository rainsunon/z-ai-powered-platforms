import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import apartmentsReducer from './apartmentsSlice';
import bookingsReducer from './bookingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    apartments: apartmentsReducer,
    bookings: bookingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
