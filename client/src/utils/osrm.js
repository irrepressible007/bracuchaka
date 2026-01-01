// OSRM public demo server for routing (driving)
// Docs: http://project-osrm.org/docs/v5.5.1/api/#route-service
// Note: public demo server has usage limits; suitable for light usage.

export async function getDrivingRoute(start, dest) {
  // start: { lat, lon }, dest: { lat, lon }
  const coords = `${start.lon},${start.lat};${dest.lon},${dest.lat}`;
  const params = new URLSearchParams({
    overview: 'full', // full polyline
    geometries: 'geojson', // easier to draw in Leaflet
    alternatives: 'false',
    steps: 'false',
  });
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to get route');
  const data = await res.json();
  if (!data.routes || !data.routes[0]) throw new Error('No route found');
  const route = data.routes[0];
  return {
    distanceMeters: route.distance, // meters
    durationSeconds: route.duration, // seconds
    geometry: route.geometry, // GeoJSON LineString
  };
}