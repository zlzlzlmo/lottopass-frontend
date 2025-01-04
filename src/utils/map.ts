export const openMap = (
  storeName: string,
  coordinates: { lat: number; lng: number }
) => {
  if (!coordinates) return;
  window.open(
    `https://map.kakao.com/link/map/${storeName},${coordinates.lat},${coordinates.lng}`,
    "_blank"
  );
};
