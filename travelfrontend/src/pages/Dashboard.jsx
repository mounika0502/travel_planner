import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RouteMap from "../components/RouteMap";
import API from "../api/axios";
import { searchPlaces } from "../api/geocode";

export default function Dashboard() {
  const navigate = useNavigate();

  // ---------------- AUTH CHECK ----------------
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  // ---------------- STATES ----------------
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [fromObj, setFromObj] = useState(null);
  const [toObj, setToObj] = useState(null);

  const [fromSug, setFromSug] = useState([]);
  const [toSug, setToSug] = useState([]);

  const [points, setPoints] = useState([]);
  const [distance, setDistance] = useState(null);

  // ---------------- COST CALCULATION ----------------
  const cost = distance ? (distance * 12).toFixed(0) : 0;

  // ---------------- SHOW ROUTE ----------------
  const showRoute = () => {
    if (!fromObj || !toObj) {
      alert("Select both locations");
      return;
    }

    setPoints([
      { lat: fromObj.lat, lng: fromObj.lon },
      { lat: toObj.lat, lng: toObj.lon },
    ]);
  };

  // ---------------- SAVE TRIP ----------------
  const saveTrip = async () => {
    if (!distance) {
      alert("Please show route first");
      return;
    }

    try {
      await API.post("trips/", {
        source: from,
        destination: to,
        distance_km: distance,
        estimated_cost: cost,
      });

      alert("Trip saved successfully ✅");
    } catch (err) {
      console.error("Save error:", err.response?.data || err);
      alert("Save failed ❌ — check console");
    }
  };

  // ---------------- RENDER ----------------
  return (
    <div className="container mt-4">
      <h3>Plan Your Trip</h3>

      {/* -------- FROM INPUT -------- */}
      <input
        className="form-control mb-2"
        placeholder="Source (From)"
        value={from}
        onChange={async (e) => {
          setFrom(e.target.value);
          const results = await searchPlaces(e.target.value);
          setFromSug(results);
        }}
      />

      {fromSug.map((p) => (
        <div
          key={p.place_id}
          className="border p-1 suggestion-item"
          onClick={() => {
            setFrom(p.display_name);
            setFromObj(p);
            setFromSug([]);
          }}
        >
          {p.display_name}
        </div>
      ))}

      {/* -------- TO INPUT -------- */}
      <input
        className="form-control mt-3 mb-2"
        placeholder="Destination (To)"
        value={to}
        onChange={async (e) => {
          setTo(e.target.value);
          const results = await searchPlaces(e.target.value);
          setToSug(results);
        }}
      />

      {toSug.map((p) => (
        <div
          key={p.place_id}
          className="border p-1 suggestion-item"
          onClick={() => {
            setTo(p.display_name);
            setToObj(p);
            setToSug([]);
          }}
        >
          {p.display_name}
        </div>
      ))}

      {/* -------- SHOW ROUTE BUTTON -------- */}
      <button onClick={showRoute} className="btn btn-primary mt-3">
        Show Route
      </button>

      {/* -------- MAP + RESULTS -------- */}
      {points.length === 2 && (
        <>
          <RouteMap points={points} setDistance={setDistance} />

          <h5 className="mt-3">📏 Distance: {distance} km</h5>
          <h5>💰 Estimated Cost: ₹{cost}</h5>

          <button className="btn btn-success mt-2" onClick={saveTrip}>
            Save Trip
          </button>
        </>
      )}
    </div>
  );
}
