import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import chargeReducer from './chargeSlice';
import paymentLookupReducer from './paymentLookupSlice';
import toastReducer from './toastSlice';

export const store = configureStore({
  reducer: {
    charge: chargeReducer,
    paymentLookup: paymentLookupReducer,
    toast: toastReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
