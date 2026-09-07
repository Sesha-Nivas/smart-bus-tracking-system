import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from "react-leaflet";
import L from "leaflet";

const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
  iconSize: [40, 40]
});

function MapComponent({ lat, lng, route }) {

  const center = [
    parseFloat(lat),
    parseFloat(lng)
  ];

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{
        height: "500px",
        width: "100%"
      }}
    >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <Marker
        position={center}
        icon={busIcon}
      >
        <Popup>
          Bus Current Location
        </Popup>
      </Marker>

      {route && route.length > 1 && (
        <Polyline
          positions={route}
          pathOptions={{
            color: "red",
            weight: 4
          }}
        />
      )}

    </MapContainer>
  );
}

export default MapComponent;