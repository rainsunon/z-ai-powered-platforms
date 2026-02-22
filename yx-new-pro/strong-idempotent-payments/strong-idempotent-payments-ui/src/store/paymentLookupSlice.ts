import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PaymentResponse, ApiProblem } from '../shared/types/payments';
import { getPayment } from '../shared/api/payments';
import { extractApiProblem } from '../shared/utils/errors';

/*
 * Async thunk: GET /api/payments/{paymentId}
 */
export const fetchPayment = createAsyncThunk<
  PaymentResponse,
  string,
  { rejectValue: ApiProblem }
>('paymentLookup/fetch', async (paymentId, { rejectWithValue }) => {
  try {
    return await getPayment(paymentId);
  } catch (err) {
    return rejectWithValue(extractApiProblem(err));
  }
});

type PaymentLookupState = {
  loading: boolean;
  data: PaymentResponse | null;
  error: ApiProblem | null;
};

const initialState: PaymentLookupState = {
  loading: false,
  data: null,
  error: null,
};

const paymentLookupSlice = createSlice({
  name: 'paymentLookup',
  initialState,
  reducers: {
    resetLookup(state) {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.data = null;
      })
      .addCase(fetchPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? { message: 'Unexpected error' };
      });
  },
});

export const { resetLookup } = paymentLookupSlice.actions;
export default paymentLookupSlice.reducer;
