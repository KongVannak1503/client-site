import React, { useState, useEffect } from "react";
import GoMapLocation from "./GoMap";
import { apiService } from "../../components/api/CrudUse";
import { useParams } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

const Items = () => {
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationConfirmed, setLocationConfirmed] = useState(null);
  const [lists, setList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Restaurant ID or some other identifier

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const data = await apiService.get(`/restaurant/items/${id}`);
        setList(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, [id]);

  const handleAddToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.name === item.name
      );
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (itemName) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.name === itemName
      );
      if (existingItem.quantity > 1) {
        return prevCart.map((cartItem) =>
          cartItem.name === itemName
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      } else {
        return prevCart.filter((cartItem) => cartItem.name !== itemName);
      }
    });
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const confirmLocation = (location) => {
    setLocationConfirmed(location);
    setIsModalOpen(false);
  };

  const generateShareLink = () => {
    if (locationConfirmed) {
      const { lat, lng } = locationConfirmed.coordinates;
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    }
    return "";
  };

  const handleCheckout = async () => {
    if (!locationConfirmed) {
      alert("Please select an address before checking out.");
      return;
    }

    // Prepare the order items for saving
    const orderItems = cart.map((item) => ({
      menu_item_id: item.id, // Assuming the item has an id field
      quantity: item.quantity,
      price: item.price,
    }));

    // Prepare the order data
    const orderData = {
      order_date: new Date(), // Current date
      order_time: new Date().toLocaleTimeString(), // Current time
      total_amount: calculateTotalPrice(),
      delivery_fee: 5.0, // Example delivery fee, adjust as needed
      order_status: "Pending", // Default status
      user: "USER_ID", // Dynamic user ID
      restaurant: id, // The restaurant ID
      order_items: orderItems,
      address: locationConfirmed.address,
      addressLink: generateShareLink(),
    };

    try {
      // Send a POST request to save the order and items
      const response = await apiService.post("/orders", orderData);
      if (response.status === 200) {
        alert("Checkout successful! Your order has been placed.");
        setCart([]); // Clear the cart
        setLocationConfirmed(null); // Reset location
      }
    } catch (err) {
      console.error("Checkout error:", err.message);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="flex flex-wrap justify-center w-full md:w-2/3 mx-auto">
        {loading ? (
          <p>Loading menu items...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          lists.map((item, index) => (
            <div key={index} className="sm:w-1/2 lg:w-1/2 w-full px-2 relative">
              <div className="border border-gray-300 rounded-lg p-4 shadow-md w-full">
                <div className="flex mb-4">
                  <div className="md:w-2/3">
                    <h2 className="font-bold text-xl mb-2">{item.name}</h2>
                    <p className="text-gray-600 mb-2">{item.description}</p>
                    <p className="font-semibold text-lg mb-4">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <img
                    src={"http://localhost:5000/" + item.image}
                    alt={item.name}
                    className="w-1/3 h-48 object-cover ml-4"
                  />
                </div>

                <button
                  className="bg-gray-200 w-10 h-10 text-lg text-dark rounded-full right-4 bottom-14 absolute r-0 hover:bg-gray-400 shadow-sm transition duration-300"
                  onClick={() => handleAddToCart(item)}
                >
                  <PlusOutlined />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border border-gray-300 rounded-lg p-4 m-2 w-1/3">
        <h2 className="font-bold text-xl">Your Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cart.map((item, index) => (
            <div key={index} className="flex items-center mb-3">
              <p className="mr-auto">
                {item.name} (x{item.quantity})
              </p>
              <div className="flex items-center mr-3">
                <button
                  className="bg-red-500 text-white rounded px-2 mx-1"
                  onClick={() => handleRemoveFromCart(item.name)}
                >
                  -
                </button>
                <button
                  className="bg-green-500 text-white rounded px-2 mx-1"
                  onClick={() => handleAddToCart(item)}
                >
                  +
                </button>
              </div>
              <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))
        )}
        <div className="flex justify-between mt-4">
          <p className="font-bold">Total:</p>
          <p className="font-bold">${calculateTotalPrice().toFixed(2)}</p>
        </div>
        <button
          className="mt-4 bg-blue-500 text-white rounded px-4 py-2"
          onClick={() => setIsModalOpen(true)}
        >
          Select Address
        </button>
        <button
          className="mt-4 bg-blue-500 text-white rounded px-4 py-2"
          onClick={handleCheckout}
        >
          Check Out
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-3/4 p-6">
            <h2 className="text-xl font-bold mb-4">Select Address</h2>
            <GoMapLocation confirmLocation={confirmLocation} />
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 text-white rounded px-4 py-2"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {locationConfirmed && (
        <div className="mt-6">
          <h3 className="font-bold text-xl">Confirmed Location:</h3>
          <p>Address: {locationConfirmed.address}</p>
          <p>
            Coordinates: {locationConfirmed.coordinates.lat},{" "}
            {locationConfirmed.coordinates.lng}
          </p>
          <div className="mt-4">
            <h4 className="font-semibold">Share this Location:</h4>
            <a
              href={generateShareLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              {generateShareLink()}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Items;
