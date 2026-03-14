import React, { useRef, useEffect } from "react";
import { GoogleMap, Marker, Polyline, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px"
};

function MapComponent({ lat, lng, route }) {

  const markerRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDsu8fka23JBnDfpohM3sREvFQUgj1wvd8"
  });

  const center = {
    lat: parseFloat(lat),
    lng: parseFloat(lng)
  };

  useEffect(() => {

    if(markerRef.current){
      markerRef.current.setPosition(center);
    }

  }, [lat, lng]);

  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
    >

      <Marker
        position={center}
        onLoad={(marker) => markerRef.current = marker}
        icon={{
          url: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
          scaledSize: new window.google.maps.Size(40,40)
        }}
      />

      {route && route.length > 1 && (
        <Polyline
          path={route}
          options={{
            strokeColor:"#ff0000",
            strokeOpacity:0.8,
            strokeWeight:4
          }}
        />
      )}

    </GoogleMap>
  );
}

export default MapComponent;