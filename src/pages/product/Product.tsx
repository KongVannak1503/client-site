import React, { useState, useEffect } from "react";
import { apiService } from "../../components/api/CrudUse";

const ProductCards = () => {
  const [items, setItems] = useState([]); // Ensure items is an empty array by default
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(""); // Track error state

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await apiService.get("/restaurants");
        console.log(data); // Log the response to verify the structure
        setItems(data || []); // Directly use `data` as the array of restaurants
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Ensure items is an array before attempting to render
  if (!Array.isArray(items)) {
    return <div>No restaurants available.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {items.length > 0 ? (
        items.map((restaurant) => (
          <div
            key={restaurant._id} // Use _id as the unique key
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="transition-transform cursor-pointer duration-300 hover:scale-105">
              <img
                src={"http://localhost:5000/" + restaurant.image}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-bold">{restaurant.name}</h2>
              <p className="text-gray-600">{restaurant.address}</p>
              <p className="text-gray-500">{`Open: ${restaurant.open_time} - Close: ${restaurant.close_time}`}</p>
              <p className="text-red-500 font-semibold">{restaurant.phone}</p>
            </div>
          </div>
        ))
      ) : (
        <div>No restaurants available.</div>
      )}
    </div>
  );
};

export default ProductCards;
