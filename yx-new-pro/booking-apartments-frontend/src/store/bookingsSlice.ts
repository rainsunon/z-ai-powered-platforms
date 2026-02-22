import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/apiClient';
import { getErrorMessage } from '@/lib/utils';
import { BookingResponse, BookingHoldRequest, ConfirmBookingRequest } from '@/types';

interface BookingsState {
  bookings: BookingResponse[];
  selectedBooking: BookingResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: BookingsState = {
  bookings: [],
  selectedBooking: null,
  loading: false,
  error: null,
};

// Async thunks
export const createBookingHold = createAsyncThunk(
  'bookings/createHold',
  async (data: BookingHoldRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<BookingResponse>('/api/bookings/hold', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchBooking = createAsyncThunk(
  'bookings/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<BookingResponse>(`/api/bookings/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const confirmBooking = createAsyncThunk(
  'bookings/confirm',
  async (
    { id, paymentRef }: { id: string; paymentRef: string },
    { rejectWithValue }
  ) => {
    try {
      const data: ConfirmBookingRequest = { paymentRef };
      const response = await apiClient.post<BookingResponse>(
        `/api/bookings/${id}/confirm`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancel',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<BookingResponse>(`/api/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Slice
const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedBooking: (state) => {
      state.selectedBooking = null;
    },
  },
  extraReducers: (builder) => {
    // Create booking hold
    builder
      .addCase(createBookingHold.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookingHold.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
        state.selectedBooking = action.payload;
      })
      .addCase(createBookingHold.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch booking
    builder
      .addCase(fetchBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBooking = action.payload;
      })
      .addCase(fetchBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Confirm booking
    builder
      .addCase(confirmBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBooking = action.payload;
        const index = state.bookings.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(confirmBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Cancel booking
    builder
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBooking = action.payload;
        const index = state.bookings.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;
