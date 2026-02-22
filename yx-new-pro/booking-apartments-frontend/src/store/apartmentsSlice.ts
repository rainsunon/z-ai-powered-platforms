import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/apiClient';
import { getErrorMessage } from '@/lib/utils';
import {
  ApartmentResponse,
  ApartmentCreateRequest,
  PagedResponse,
  SearchParams,
  AvailabilityResponse,
} from '@/types';

interface ApartmentsState {
  apartments: ApartmentResponse[];
  selectedApartment: ApartmentResponse | null;
  availability: Record<string, AvailabilityResponse>;
  searchResults: PagedResponse<ApartmentResponse> | null;
  loading: boolean;
  error: string | null;
}

const initialState: ApartmentsState = {
  apartments: [],
  selectedApartment: null,
  availability: {},
  searchResults: null,
  loading: false,
  error: null,
};

// Async thunks
export const createApartment = createAsyncThunk(
  'apartments/create',
  async (data: ApartmentCreateRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<ApartmentResponse>('/api/apartments', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchApartment = createAsyncThunk(
  'apartments/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<ApartmentResponse>(`/api/apartments/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const checkAvailability = createAsyncThunk(
  'apartments/checkAvailability',
  async (
    { id, from, to }: { id: string; from: string; to: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get<AvailabilityResponse>(
        `/api/apartments/${id}/availability?from=${from}&to=${to}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const searchAvailability = createAsyncThunk(
  'apartments/search',
  async (params: SearchParams, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.city) queryParams.append('city', params.city);
      if (params.capacity) queryParams.append('capacity', params.capacity.toString());
      queryParams.append('from', params.from);
      queryParams.append('to', params.to);
      queryParams.append('page', (params.page || 0).toString());
      queryParams.append('size', (params.size || 20).toString());

      const response = await apiClient.get<PagedResponse<ApartmentResponse>>(
        `/api/availability/search?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Slice
const apartmentsSlice = createSlice({
  name: 'apartments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedApartment: (state) => {
      state.selectedApartment = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = null;
    },
  },
  extraReducers: (builder) => {
    // Create apartment
    builder
      .addCase(createApartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApartment.fulfilled, (state, action) => {
        state.loading = false;
        state.apartments.push(action.payload);
      })
      .addCase(createApartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch apartment
    builder
      .addCase(fetchApartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApartment.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedApartment = action.payload;
      })
      .addCase(fetchApartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Check availability
    builder
      .addCase(checkAvailability.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability[action.payload.apartmentId] = action.payload;
      })
      .addCase(checkAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Search availability
    builder
      .addCase(searchAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedApartment, clearSearchResults } = apartmentsSlice.actions;
export default apartmentsSlice.reducer;
