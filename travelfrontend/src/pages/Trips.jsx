import { useState } from "react";
import API from "../api/axios";

export default function Trips() {
  const [trip, setTrip] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });

  const createTrip = async () => {
    await API.post("trips/", trip);
    alert("Trip created");
  };

  return (
    <div className="container mt-4">
      <h3>Create Trip</h3>

      <input
        className="form-control mb-2"
        placeholder="Trip Name"
        onChange={(e) => setTrip({ ...trip, name: e.target.value })}
      />

      <input
        type="date"
        className="form-control mb-2"
        onChange={(e) => setTrip({ ...trip, start_date: e.target.value })}
      />

      <input
        type="date"
        className="form-control mb-2"
        onChange={(e) => setTrip({ ...trip, end_date: e.target.value })}
      />

      <button className="btn btn-primary" onClick={createTrip}>
        Create Trip
      </button>
    </div>
  );
}
