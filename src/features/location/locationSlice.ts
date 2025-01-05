import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
  myLocation: { latitude: number; longitude: number } | null; // 위도, 경도
  myAddress: string | null; // 행정구역 주소
  error: string | null; // 에러 메시지
}

const initialState: LocationState = {
  myLocation: null,
  myAddress: null,
  error: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    // 위치 정보 설정
    setLocation(
      state,
      action: PayloadAction<{ latitude: number; longitude: number }>
    ) {
      state.myLocation = action.payload;
      state.error = null;
    },
    // 행정구역 주소 설정
    setAddress(state, action: PayloadAction<string>) {
      state.myAddress = action.payload;
    },
    // 에러 설정
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    // 위치 정보 초기화
    clearLocation(state) {
      state.myLocation = null;
      state.myAddress = null;
      state.error = null;
    },
  },
});

export const { setLocation, setAddress, setError, clearLocation } =
  locationSlice.actions;

export default locationSlice.reducer;
