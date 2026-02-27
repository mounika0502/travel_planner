import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "350px",
};

export default function MapView({ location, onSelect }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyA49Poj4bkai_oVzP5EkWDf99pEKPUz-LA",
  });

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={location}
      zoom={10}
      onClick={(e) =>
        onSelect({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        })
      }
    >
      <Marker position={location} />

    </GoogleMap>
  );
}
