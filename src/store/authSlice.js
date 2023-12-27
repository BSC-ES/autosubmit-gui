import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    user_id: null
}

const authSlice = createSlice({
    name: "auth",
    initialState: { ...initialState },
    reducers: {
        reset: () => initialState,
        setLogin: (state, action) => {
            state.token = action.payload.token
            state.user_id = action.payload.user_id
        }
    }
})

export const authActions = authSlice.actions;

export default authSlice;