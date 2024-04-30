/*
 * @copyRight by md sarwar hoshen.
 */
import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
//
const libraries = ['places'];
//
const Map = ({ location }) => {
  //
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: libraries
  });
  //
  if (loadError) {
    return <div>Error loading maps</div>;
  }
  //
  if (!isLoaded) {
    return <div>Loading maps</div>;
  }
  //
  return (
    <GoogleMap
      mapContainerStyle={{
        width: "400px",
        height: "400px",
        borderRadius: 10
      }}
      zoom={15}
      center={location}
    >
      <Marker position={location} />
    </GoogleMap>
  );
};
//
export default Map;
