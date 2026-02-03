import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import { autosubmitApiV3 } from "../services/autosubmitApiV3";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import appSlice from "./appSlice";
import toastSlice from "./toastSlice";

const store = configureStore({
    reducer: {
        app: appSlice.reducer,
        auth: authSlice.reducer,
        toast: toastSlice.reducer,
        [autosubmitApiV4.reducerPath]: autosubmitApiV4.reducer,
        [autosubmitApiV3.reducerPath]: autosubmitApiV3.reducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat([
            autosubmitApiV4.middleware,
            autosubmitApiV3.middleware
        ])
    }
});
export default store;