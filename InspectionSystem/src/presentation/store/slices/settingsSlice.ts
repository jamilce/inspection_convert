import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
    language: 'en' | 'ar';
    theme: 'light' | 'dark';
}

const initialState: SettingsState = {
    // Try to load initial language from localStorage where old app stored it, default 'ar'
    language: (localStorage.getItem('i18nextLng') as 'en' | 'ar') || 'ar',
    theme: 'light',
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<'en' | 'ar'>) => {
            state.language = action.payload;
            localStorage.setItem('i18nextLng', action.payload);
            // document direction is usually handled in a useEffect in App.tsx
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
        },
    },
});

export const { setLanguage, setTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
