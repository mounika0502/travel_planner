import axios from "axios";

export async function getNearbyPlaces(lat, lng) {
  const query = `
  [out:json];
  (
    node["tourism"="hotel"](around:3000,${lat},${lng});
    node["amenity"="restaurant"](around:3000,${lat},${lng});
  );
  out body;
  `;

  const res = await axios.post(
    "https://overpass-api.de/api/interpreter",
    query,
    { headers: { "Content-Type": "text/plain" } }
  );

  return res.data.elements;
}
