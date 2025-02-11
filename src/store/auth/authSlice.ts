import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'checking', // 'checking', 'not-authenticated', 'authenticated'
        id: null,
        displayName: null,
        errorMessage: null,
    },
    reducers: {
        onLogin: ( state, { payload } ) => {
            state.status = 'authenticated';
            state.id = payload.entity;
            state.displayName = payload.displayName || payload.message?.split(' ')[1] || payload.message;
            state.errorMessage = null;
        },
        onLogout: ( state, { payload } ) => {
            state.status = 'not-authenticated'; // 'checking', 'not-authenticated', 'authenticated'
            state.id = null;
            state.displayName = null;
            state.errorMessage = payload?.errorMessage || null;
        },
        onCheckingCredentials: (state) => {
            state.status = 'checking';
        },
    }
});


// Action creators are generated for each case reducer function
export const { onLogin, onLogout, onCheckingCredentials } = authSlice.actions;