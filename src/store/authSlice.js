import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    user_id: null,
    isInitialized: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState: { ...initialState },
    reducers: {
        reset: () => initialState,
        login: (state, action) => {
            state.token = action.payload.token
            state.user_id = action.payload.user_id
            state.isInitialized = true
        },
        logout: (state) => {
            state.token = null
            state.user_id = null
            state.isInitialized = true
        }
    }
})

export const authActions = authSlice.actions;

export default authSlice;