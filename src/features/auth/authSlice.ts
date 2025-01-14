import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "lottopass-shared";

interface AuthState {
  user: UserProfile | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    clearUser: (state) => {
      localStorage.removeItem("accessToken");
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
