import React, { useEffect, useRef, useState } from "react";

const GoMapLocation = ({ confirmLocation }) => {
  const mapContainerRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = "AlzaSyosfLcfy3cpTFFNB1aYJC226c7iSx404pD"; // Replace with your actual API key

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.gomaps.pro/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      setError("Failed to load Google Maps API.");
    };

    document.body.appendChild(script);

    window.initMap = () => initializeMap();

    return () => {
      delete window.initMap;
    };
  }, [apiKey]);

  const initializeMap = () => {
    if (!window.google) {
      setError("Google Maps API is not available.");
      return;
    }

    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: { lat: 13.363221, lng: 103.859799 },
      zoom: 14,
    });

    map.addListener("click", (event) => {
      const { latLng } = event;
      const lat = latLng.lat();
      const lng = latLng.lng();

      setSelectedLocation({ lat, lng });

      new window.google.maps.Marker({
        position: { lat, lng },
        map,
      });
    });
  };

  const confirmLocationHandler = () => {
    if (!selectedLocation) {
      setError("Please select a location on the map.");
      return;
    }

    setLoading(true);

    const geocoder = new window.google.maps.Geocoder();
    const latLng = new window.google.maps.LatLng(
      selectedLocation.lat,
      selectedLocation.lng
    );

    geocoder.geocode({ location: latLng }, (results, status) => {
      setLoading(false);

      if (status === "OK" && results[0]) {
        const confirmedLocation = {
          coordinates: selectedLocation,
          address: results[0].formatted_address,
        };
        confirmLocation(confirmedLocation); // Pass confirmed location to parent
      } else {
        setError("Unable to retrieve the address for the selected location.");
      }
    });
  };

  return (
    <div>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "400px" }}
      ></div>
      {error && <div className="text-red-500">{error}</div>}
      {loading && <div>Loading...</div>}
      <button
        onClick={confirmLocationHandler}
        className="bg-green-600 text-white px-4 py-2 mt-4"
      >
        Confirm Location
      </button>
    </div>
  );
};

export default GoMapLocation;
