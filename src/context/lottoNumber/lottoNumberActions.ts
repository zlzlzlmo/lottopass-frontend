export const SET_REQUIRED_NUMBERS = "SET_REQUIRED_NUMBERS" as const;
export const SET_MIN_COUNT = "SET_MIN_COUNT" as const;
export const RESET_NUMBER = "RESET_NUMBER" as const;

export const setRequiredNumbers = (payload: number[]) => ({
  type: SET_REQUIRED_NUMBERS,
  payload,
});

export const setMinCount = (payload: number) => ({
  type: SET_MIN_COUNT,
  payload,
});

export const resetLottoNumbers = () => ({
  type: RESET_NUMBER,
});

export type Action =
  | ReturnType<typeof setRequiredNumbers>
  | ReturnType<typeof setMinCount>
  | ReturnType<typeof resetLottoNumbers>;
