import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    breadcrumb_items: []
}

const appSlice = createSlice({
    name: "app",
    initialState: { ...initialState },
    reducers: {
        reset: () => initialState,
        setBreadcrumbItems: (state, action) => {
            state.breadcrumb_items = action.payload
        }
    }
})

export const appActions = appSlice.actions;

export default appSlice;