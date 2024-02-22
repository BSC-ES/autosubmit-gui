import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    breadcrumb_items: [],
    theme: "light"
}

const appSlice = createSlice({
    name: "app",
    initialState: { ...initialState },
    reducers: {
        reset: () => initialState,
        setBreadcrumbItems: (state, action) => {
            state.breadcrumb_items = action.payload;
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        toggleTheme: (state) => {
            if (state.theme === "light") {
                state.theme = "dark";
                localStorage.setItem("asgui.theme", "dark");
                document.documentElement.classList.add("dark");
            } else {
                state.theme = "light";
                localStorage.setItem("asgui.theme", "light");
                document.documentElement.classList.remove("dark");
            }
        }
    }
})

export const appActions = appSlice.actions;

export default appSlice;