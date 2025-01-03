export const SET_MY_LOCATION = "SET_MY_LOCATION" as const;

export const setMyLocation = (
  payload: { lat: number; lng: number } | null
) => ({
  type: SET_MY_LOCATION,
  payload,
});

export type Action = ReturnType<typeof setMyLocation>;
