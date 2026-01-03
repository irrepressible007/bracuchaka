// Geocode a text query (e.g., "Banani, Dhaka") to { lat, lon }
// Uses OpenStreetMap Nominatim public API
export async function geocodeText(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`Geocode failed: ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No geocode results found');
  }
  const top = data[0];
  return { lat: parseFloat(top.lat), lon: parseFloat(top.lon) };
}