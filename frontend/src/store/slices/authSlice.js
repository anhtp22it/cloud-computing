import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: "",
  refreshToken: "",
  tokenType: "Bearer",
  user: null,
  loading: false,
  error: null,
};

export const counterSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.accessToken = action.payload.access_token;
      state.tokenType = action.payload.token_type || "Bearer";
      if (action.payload.refresh_token) {
        state.refreshToken = action.payload.refresh_token;
      }
    },
    clearToken: (state) => {
      state.accessToken = "";
      state.refreshToken = "";
      state.tokenType = "Bearer";
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setToken, clearToken, setUser, setLoading, setError } =
  counterSlice.actions;
export default counterSlice.reducer;
