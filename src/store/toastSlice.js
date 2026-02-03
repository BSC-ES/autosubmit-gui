import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    toasts: [
      // Example toasts for demonstration purposes
      // {
      //   id: 3,
      //   message: "This is an error toast with a large text to demonstrate how the toast component handles longer messages without breaking the layout or overflowing the container. Here is a traceback example: Error at line 42 in someFile.js\n    at anotherFunction (anotherFile.js:10:5)\n    at main (mainFile.js:20:3)",
      //   type: "error",
      //   duration: 50000,
      // },
    ],
  },
  reducers: {
    showToast: (state, action) => {
      const { id, message, type = "info", duration = 5000 } = action.payload;
      state.toasts.push({
        id: id || Date.now(),
        message,
        type,
        duration,
      });
    },
    hideToast: (state, action) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload,
      );
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { showToast, hideToast, clearAllToasts } = toastSlice.actions;
export default toastSlice;
