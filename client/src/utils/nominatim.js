

export async function searchPlaces(query) {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    addressdetails: '1',
    limit: '5',
    countrycodes: 'bd', // optional: prefer Bangladesh
  });
  const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to query places');
  return res.json(); // array of { display_name, lat, lon, ... }
}