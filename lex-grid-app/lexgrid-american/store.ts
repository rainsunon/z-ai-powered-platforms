import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Auth Slice
interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

// Lawyers Slice
interface LawyersState {
  lawyers: any[];
  loading: boolean;
  error: string | null;
  filters: {
    jurisdiction?: 'USA' | 'Canada';
    specialty?: string;
    location?: string;
  };
}

const initialLawyersState: LawyersState = {
  lawyers: [],
  loading: false,
  error: null,
  filters: {},
};

const lawyersSlice = createSlice({
  name: 'lawyers',
  initialState: initialLawyersState,
  reducers: {
    setLawyers: (state, action: PayloadAction<any[]>) => {
      state.lawyers = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setFilters: (state, action: PayloadAction<LawyersState['filters']>) => {
      state.filters = action.payload;
    },
  },
});

// Law Search Slice
interface LawSearchState {
  results: any[];
  loading: boolean;
  error: string | null;
  history: string[];
}

const initialLawSearchState: LawSearchState = {
  results: [],
  loading: false,
  error: null,
  history: [],
};

const lawSearchSlice = createSlice({
  name: 'lawSearch',
  initialState: initialLawSearchState,
  reducers: {
    setResults: (state, action: PayloadAction<any[]>) => {
      state.results = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addToHistory: (state, action: PayloadAction<string>) => {
      if (!state.history.includes(action.payload)) {
        state.history = [action.payload, ...state.history].slice(0, 10);
      }
    },
  },
});

// Configure Store
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    lawyers: lawyersSlice.reducer,
    lawSearch: lawSearchSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export actions
export const { setUser, setLoading: setAuthLoading, logout } = authSlice.actions;
export const {
  setLawyers,
  setLoading: setLawyersLoading,
  setError: setLawyersError,
  setFilters: setLawyersFilters,
} = lawyersSlice.actions;
export const {
  setResults,
  setLoading,
  setError,
  addToHistory,
} = lawSearchSlice.actions;
