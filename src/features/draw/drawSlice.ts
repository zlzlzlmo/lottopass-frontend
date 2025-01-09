import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { drawService } from "@/api";
import { LottoDraw } from "lottopass-shared";

interface DrawState {
  allDraws: LottoDraw[];
  loading: boolean;
  error: string | null;
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
      const data: LottoDraw[] = await drawService.getAllDraws();
      return data;
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("An unknown error occurred");
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
