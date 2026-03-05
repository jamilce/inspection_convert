import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '../../../domain/entities/User';
import { AuthRepository } from '../../../data/repositories/AuthRepository';
import type { LoginRequest } from '../../../data/repositories/AuthRepository';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: LoginRequest, { rejectWithValue }) => {
        try {
            const user = await AuthRepository.login(credentials);
            return user;
        } catch (err: any) {
            return rejectWithValue(err.message || 'Login failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            AuthRepository.logout();
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
