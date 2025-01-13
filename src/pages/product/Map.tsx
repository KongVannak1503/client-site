import React, { useState } from "react";

const SiemReapMap = () => {
  const [address, setAddress] = useState({
    road: "",
    city: "",
    country: "",
    county: "",
    postcode: "",
    suburb: "",
    state: "",
    neighbourhood: "", // Initialize neighbourhood state
  });
  const [loading, setLoading] = useState(false); // Initialize loading as false
  const [showAddress, setShowAddress] = useState(false); // State to control displaying address

  const getCurrentAddress = () => {
    setLoading(true); // Set loading to true when fetching data

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            console.log(data); // Log the entire data object to check the response structure
            setAddress({
              road: data.address.road || "",
              city: data.address.city || "",
              country: data.address.country || "",
              county: data.address.county || "",
              postcode: data.address.postcode || "",
              suburb: data.address.suburb || "", // This may be undefined
              state: data.address.state || "",
              neighbourhood: data.address.neighbourhood || "", // Set neighbourhood
            });
            setShowAddress(true); // Show the address after fetching
            setLoading(false); // Set loading to false after data is fetched
          })
          .catch((error) => {
            console.error("Error fetching address:", error);
            setLoading(false); // Set loading to false on error
          });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLoading(false); // Set loading to false on geolocation error
      }
    );
  };

  return (
    <div>
      <h1>Get Current Location</h1>
      <button onClick={getCurrentAddress}>Get Current Address</button>
      {loading && <p>Loading...</p>} {/* Show loading message while fetching */}
      {showAddress && (
        <div>
          <h2>Address Information</h2>
          <label>
            State and Neighbourhood:
            <input
              type="text"
              value={`${address.state}, ${
                address.suburb || address.neighbourhood
              }`} // Show both state and neighbourhood
              readOnly
            />
          </label>
          <br />
          <label>
            Suburb:
            <input
              type="text"
              value={address.suburb || "Not available"} // Suburb input
              readOnly
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default SiemReapMap;
