import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { drawService } from "@/api";
import { LottoDraw } from "lottopass-shared";

// 초기 상태 정의
interface DrawState {
  allDraws: LottoDraw[]; // 모든 회차 데이터
  loading: boolean; // 로딩 상태
  error: string | null; // 에러 메시지
}

const initialState: DrawState = {
  allDraws: [],
  loading: false,
  error: null,
};

export const fetchAllDraws = createAsyncThunk(
  "draws/fetchAllDraws",
  async (_, { rejectWithValue }) => {
    try {
      const response = await drawService.getAllRounds();
      if (response.status === "success") {
        return response.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message); // Error 객체
      }
      return rejectWithValue("An unknown error occurred"); // 알 수 없는 에러
    }
  }
);

// 슬라이스 생성
const drawSlice = createSlice({
  name: "draws",
  initialState,
  reducers: {
    clearAllDraws: (state) => {
      state.allDraws = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDraws.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDraws.fulfilled, (state, action) => {
        state.loading = false;
        state.allDraws = action.payload;
      })
      .addCase(fetchAllDraws.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAllDraws } = drawSlice.actions;
export default drawSlice.reducer;
