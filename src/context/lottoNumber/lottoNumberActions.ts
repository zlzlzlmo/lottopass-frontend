export const SET_EXCLUDE_NUMBERS = "SET_EXCLUDE_NUMBERS" as const;
export const SET_MIN_COUNT = "SET_MIN_COUNT" as const;
export const RESET_NUMBER = "RESET_NUMBER" as const;

export const setExcludeNumbers = (payload: number[]) => ({
  type: SET_EXCLUDE_NUMBERS,
  payload,
});

export const setMinCount = (payload: number) => ({
  type: SET_MIN_COUNT,
  payload,
});

export const resetLottoNumber = () => ({
  type: RESET_NUMBER,
});
