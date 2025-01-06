export const calculateDistance = (
  current: { lat: number; lng: number },
  target?: { lat: number; lng: number }
): number => {
  if (!target) return Infinity;
  const R = 6371;
  const dLat = ((target.lat - current.lat) * Math.PI) / 180;
  const dLng = ((target.lng - current.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((current.lat * Math.PI) / 180) *
      Math.cos((target.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getDistanceText = (distance?: number) => {
  if (!distance) return null;
  return isFinite(distance) ? `${distance.toFixed(2)} km` : null;
};
