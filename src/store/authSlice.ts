import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    // Demo: login with a mock user
    loginDemo(state) {
      state.user = {
        id: 'demo-user-1',
        email: 'demo@val5th.gg',
        displayName: 'DemoPlayer',
      };
      state.isAuthenticated = true;
      state.isLoading = false;
    },
  },
});

export const { setUser, setLoading, logout, loginDemo } = authSlice.actions;
export default authSlice.reducer;
