import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    name: null,
    email: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.name = action.payload;
    },

    clearToken: (state) => {
      state.token = null;
      state.name = null;
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;

export default authSlice.reducer;
