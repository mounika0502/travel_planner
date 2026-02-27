import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { getNearbyPlaces } from "../api/places";

// ---------------- Haversine Distance ----------------
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function RouteMap({ points, setDistance }) {
  const [places, setPlaces] = useState([]);
  const [travelMode, setTravelMode] = useState("");
  const [travelTime, setTravelTime] = useState("");
  const [flightPrice, setFlightPrice] = useState(null);
  const [calculatedDistance, setCalculatedDistance] = useState(0);
  const [packages, setPackages] = useState([]);

  // Stable Images
  const hotelImage =
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";

  const restaurantImage =
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80";

  // ---------------- OPEN GOOGLE LINKS ----------------
  const openHotel = (place) => {
    const name = place.tags?.name || "hotel";
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(name + " hotel")}`,
      "_blank"
    );
  };

  const openRestaurant = (place) => {
    const name = place.tags?.name || "restaurant";
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(name + " restaurant")}`,
      "_blank"
    );
  };

  // ---------------- FETCH PACKAGES ----------------
  const fetchPackages = async (distance, type) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/packages/?distance=${distance}&type=${type}`
      );
      const data = await res.json();
      setPackages(data);
    } catch (err) {
      console.log("Package fetch error:", err);
    }
  };

  // ---------------- TRAVEL CALCULATION ----------------
  const calculateTravel = (km) => {
    const formatted = parseFloat(km).toFixed(2);

    setDistance(formatted);
    setCalculatedDistance(formatted);

    if (km < 1500) {
      setTravelMode("road");
      setTravelTime((km / 60).toFixed(1));
      setFlightPrice(null);
      fetchPackages(km, "road");
    } else {
      setTravelMode("flight");
      setTravelTime((km / 800).toFixed(1));
      const price = 2500 + km * 6;
      setFlightPrice(price.toFixed(0));
      fetchPackages(km, "flight");
    }
  };

  // ---------------- MAP + ROUTE ----------------
  useEffect(() => {
    if (!points || points.length !== 2) return;

    const map = L.map("route-map").setView(
      [points[0].lat, points[0].lng],
      6
    );

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    ).addTo(map);

    const routing = L.Routing.control({
      waypoints: points.map(p => L.latLng(p.lat, p.lng)),
      addWaypoints: false,
      draggableWaypoints: false,
      show: false
    }).addTo(map);

    routing.on("routesfound", e => {
      const km = e.routes[0].summary.totalDistance / 1000;
      calculateTravel(km);
    });

    routing.on("routingerror", () => {
      const km = getDistance(
        points[0].lat,
        points[0].lng,
        points[1].lat,
        points[1].lng
      );
      calculateTravel(km);
    });

    return () => map.remove();
  }, [points]);

  // ---------------- LOAD DESTINATION NEARBY PLACES ----------------
  useEffect(() => {
    if (!points || points.length !== 2) return;

    const destination = points[1]; // ALWAYS second point
    setPlaces([]); // Clear old data immediately

    console.log("Fetching nearby for:", destination);

    getNearbyPlaces(destination.lat, destination.lng)
      .then(res => {
        const enriched = res.map(place => ({
          ...place,
          dist: getDistance(
            destination.lat,
            destination.lng,
            place.lat,
            place.lon
          )
        }));

        setPlaces(enriched.sort((a, b) => a.dist - b.dist));
      })
      .catch(err => console.log(err));
  }, [points]);

  return (
    <>
      <div id="route-map" style={{ height: "400px" }} />

      {/* TRAVEL INFO */}
      {travelMode && (
        <div className="mt-3 p-3 bg-light rounded shadow text-center">
          <h5>📏 Distance: {calculatedDistance} km</h5>

          {travelMode === "road" && (
            <h5>🚗 Via Car • Approx {travelTime} hrs</h5>
          )}

          {travelMode === "flight" && (
            <>
              <h5>✈ Via Flight • Approx {travelTime} hrs</h5>
              <h5 className="text-success">
                💵 Estimated Ticket: ₹{flightPrice}
              </h5>
            </>
          )}
        </div>
      )}

      {/* PACKAGES */}
      {packages.length > 0 && (
        <>
          <h4 className="mt-5 mb-3">🏖 Suggested Packages</h4>
          <div className="row">
            {packages.map(pkg => (
              <div key={pkg.id} className="col-md-4 mb-3">
                <div className="card p-3 shadow-sm">
                  <h5>{pkg.title}</h5>
                  <p>{pkg.description}</p>
                  <h6 className="text-primary">₹{pkg.price}</h6>
                  <button className="btn btn-warning w-100">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* HOTELS */}
      <h4 className="mt-5 mb-3">🏨 Hotels Near Destination</h4>
      {places
        .filter(p => p.tags?.tourism === "hotel")
        .slice(0, 6)
        .map(p => (
          <div key={p.id} className="card mb-4 p-3 shadow-sm">
            <div className="row align-items-center">
              <div className="col-md-3">
                <img
                  src={hotelImage}
                  className="img-fluid rounded"
                  alt="hotel"
                />
              </div>
              <div className="col-md-6">
                <h5>{p.tags?.name}</h5>
                <p>📍 {p.dist.toFixed(2)} km away</p>
              </div>
              <div className="col-md-3 text-end">
                <button
                  className="btn btn-primary w-100"
                  onClick={() => openHotel(p)}
                >
                  Check Availability
                </button>
              </div>
            </div>
          </div>
        ))}

      {/* RESTAURANTS */}
      <h4 className="mt-5 mb-3">🍽 Restaurants Near Destination</h4>
      {places
        .filter(p => p.tags?.amenity === "restaurant")
        .slice(0, 6)
        .map(p => (
          <div key={p.id} className="card mb-4 p-3 shadow-sm">
            <div className="row align-items-center">
              <div className="col-md-3">
                <img
                  src={restaurantImage}
                  className="img-fluid rounded"
                  alt="restaurant"
                />
              </div>
              <div className="col-md-6">
                <h5>{p.tags?.name}</h5>
                <p>📍 {p.dist.toFixed(2)} km away</p>
              </div>
              <div className="col-md-3 text-end">
                <button
                  className="btn btn-outline-success w-100"
                  onClick={() => openRestaurant(p)}
                >
                  🔍 Google Search
                </button>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
