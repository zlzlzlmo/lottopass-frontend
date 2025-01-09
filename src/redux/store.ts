import { configureStore } from "@reduxjs/toolkit";
import drawReducer from "@/features/draw/drawSlice";
import locationReducer from "@features/location/locationSlice";
import authSlice from "@features/auth/authSlice";

export const store = configureStore({
  reducer: {
    draw: drawReducer,
    location: locationReducer,
    auth: authSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
});

// 스토어의 타입을 자동으로 추론
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
