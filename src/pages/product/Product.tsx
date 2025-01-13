import React, { useState, useEffect } from "react";
import { apiService } from "../../components/api/CrudUse";
import { HeartOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const ProductCards = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]); // Track the shopping cart items
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await apiService.get("/restaurants");
        console.log(data);
        setItems(data || []);
      } catch (err) {
        setError("Failed to fetch restaurants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();

    // Load cart from cookies when the component mounts
    const savedCart = Cookies.get("cart");

    try {
      setCart(savedCart ? JSON.parse(savedCart) : []);
    } catch (e) {
      console.error("Error parsing cart from cookies:", e);
      setCart([]); // Default to an empty array if parsing fails
    }
  }, []);

  // Handle loading state
  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div className="text-center p-6 text-red-500">{error}</div>;
  }

  // Handle heart icon click - add to cart and save to cookies
  const handleHeartClick = (product) => {
    // Check if the product already exists in the cart
    const existingItemIndex = cart.findIndex(
      (item) => item._id === product._id
    );

    let updatedCart;

    if (existingItemIndex !== -1) {
      // If the item exists, increase the quantity by 1
      updatedCart = [...cart];
      updatedCart[existingItemIndex].qty += 1;
    } else {
      // If the item doesn't exist, add it with a default quantity of 1
      updatedCart = [...cart, { ...product, qty: 1 }];
    }

    // Update state and save the updated cart in cookies
    setCart(updatedCart);
    Cookies.set("cart", JSON.stringify(updatedCart)); // Save updated cart to cookies
  };

  // Ensure items is an array before attempting to render
  if (!Array.isArray(items)) {
    return <div className="text-center p-6">No restaurants available.</div>;
  }

  // Handle navigation to a specific item's page
  const getItem = (id) => {
    navigate(`/items/${id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {items.length > 0 ? (
        items.map((restaurant) => (
          <div
            key={restaurant._id} // Use _id as the unique key
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="relative">
              <div className="transition-transform relative cursor-pointer duration-300 hover:scale-105">
                <img
                  onClick={() => getItem(restaurant._id)}
                  src={"http://localhost:5000/" + restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <button
                className="w-[35px] h-[35px] flex justify-center items-center bg-white rounded-full text-lg shadow-md absolute top-3 right-3 hover:bg-red-100 transition duration-300"
                onClick={() => handleHeartClick(restaurant)}
              >
                <HeartOutlined className="text-red-500" />
              </button>
            </div>
            <div className="py-2 px-4">
              <h2
                onClick={() => getItem(restaurant._id)} // Fixed onClick issue
                className="text-lg font-bold cursor-pointer hover:underline"
              >
                {restaurant.name}
              </h2>
              <p className="text-gray-600">{restaurant.address}</p>
              <p className="text-gray-500">{`Open: ${restaurant.open_time} - Close: ${restaurant.close_time}`}</p>
              <p className="text-gray-500 font-semibold">
                {restaurant.description}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center col-span-3">No restaurants available.</div>
      )}
    </div>
  );
};

export default ProductCards;
