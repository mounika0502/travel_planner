import axios from "axios";

export const searchPlaces = async (query) => {
  if (!query) return [];

  const res = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: query,
        format: "json",
        addressdetails: 1,
        limit: 8,
        "accept-language": "en",
        dedupe: 1
      },
      headers: {
        "Accept-Language": "en"
      }
    }
  );

  return res.data;
};
