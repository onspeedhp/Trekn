export const calculateDistance = (
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
) => {
  // Haversine formula used to calculate distances between two points on the Earth's surface,
  // the variables a and c represent intermediate calculations.
  const R = 6371000; // Radius of the Earth in meters
  const differenceLatitude = (latitude2 - latitude1) * (Math.PI / 180);
  const differenceLongitude = (longitude2 - longitude1) * (Math.PI / 180);
  const a =
    Math.sin(differenceLatitude / 2) * Math.sin(differenceLatitude / 2) +
    Math.cos(latitude1 * (Math.PI / 180)) *
      Math.cos(latitude2 * (Math.PI / 180)) *
      Math.sin(differenceLongitude / 2) *
      Math.sin(differenceLongitude / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

export function convertDistance(distance: number): string {
  if (distance >= 1000) {
    return (distance / 1000).toFixed(2) + ' km'; // Convert to kilometers and keep 2 decimal places
  } else {
    return distance + ' m'; // Keep as meters
  }
}
