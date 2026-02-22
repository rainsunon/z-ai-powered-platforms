import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ChargeRequest, ChargeResult, ApiProblem } from '../shared/types/payments';
import { chargePayment } from '../shared/api/payments';
import { extractApiProblem } from '../shared/utils/errors';

/*
 * Async thunk: POST /api/payments/charges
 */
export const submitCharge = createAsyncThunk<
  ChargeResult,
  { idempotencyKey: string; payload: ChargeRequest },
  { rejectValue: ApiProblem }
>('charge/submit', async (args, { rejectWithValue }) => {
  try {
    return await chargePayment(args.idempotencyKey, args.payload);
  } catch (err) {
    return rejectWithValue(extractApiProblem(err));
  }
});

type ChargeState = {
  loading: boolean;
  lastResult: ChargeResult | null;
  lastPayload: ChargeRequest | null;
  lastKey: string | null;
  error: ApiProblem | null;
};

const initialState: ChargeState = {
  loading: false,
  lastResult: null,
  lastPayload: null,
  lastKey: null,
  error: null,
};

const chargeSlice = createSlice({
  name: 'charge',
  initialState,
  reducers: {
    resetCharge(state) {
      state.lastResult = null;
      state.lastPayload = null;
      state.lastKey = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitCharge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitCharge.fulfilled, (state, action) => {
        state.loading = false;
        state.lastResult = action.payload;
        state.lastPayload = action.meta.arg.payload;
        state.lastKey = action.meta.arg.idempotencyKey;
        state.error = null;
      })
      .addCase(submitCharge.rejected, (state, action) => {
        state.loading = false;
        state.lastResult = null;
        state.error = action.payload ?? { message: 'Unexpected error' };
      });
  },
});

export const { resetCharge } = chargeSlice.actions;
export default chargeSlice.reducer;
