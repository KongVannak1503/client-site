import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2"; // Import SweetAlert2

const ShoppingCard = () => {
  const [cart, setCart] = useState([]); // Track cart items

  useEffect(() => {
    // Load cart items from cookie
    const savedCart = Cookies.get("cart");

    // Check if the cart data exists and is a valid JSON string
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart)); // Attempt to parse the saved cart from cookie
      } catch (error) {
        console.error("Error parsing the cart cookie:", error); // Log error if JSON is invalid
      }
    } else {
      setCart([]); // If the cart cookie doesn't exist, initialize with an empty array
    }
  }, []);

  // Remove item from cart with SweetAlert confirmation
  const removeFromCart = (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to remove this item from the cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCart = cart.filter((item) => item._id !== productId);
        setCart(updatedCart);
        Cookies.set("cart", JSON.stringify(updatedCart)); // Update the cookie with the new cart
        Swal.fire(
          "Removed!",
          "The item has been removed from your cart.",
          "success"
        );
      }
    });
  };

  // Clear all items from cart with SweetAlert confirmation
  const clearCart = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to clear all items from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, clear it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setCart([]);
        Cookies.remove("cart"); // Remove the cart cookie
        Swal.fire(
          "Cleared!",
          "All items have been removed from your cart.",
          "success"
        );
      }
    });
  };

  // Update quantity in the cart
  const updateQuantity = (productId, action) => {
    const updatedCart = cart.map((item) => {
      if (item._id === productId) {
        const updatedItem = { ...item };

        // Increase or decrease quantity based on action
        if (action === "increase") {
          updatedItem.qty += 1;
        } else if (action === "decrease" && updatedItem.qty > 1) {
          updatedItem.qty -= 1;
        }
        return updatedItem;
      }
      return item;
    });

    setCart(updatedCart); // Update state
    Cookies.set("cart", JSON.stringify(updatedCart)); // Update the cookie with the new cart
  };

  // Group items by _id and merge quantities
  const groupedCart = cart.reduce((acc, item) => {
    const existingItem = acc.find((i) => i._id === item._id);
    if (existingItem) {
      existingItem.qty += item.qty;
    } else {
      acc.push(item);
    }
    return acc;
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>

      {groupedCart.length === 0 ? (
        <div className="text-center">Your shopping cart is empty.</div>
      ) : (
        <div>
          <div className="space-y-4">
            {groupedCart.map((item) => (
              <div
                key={item._id} // Use _id as the unique key for each item
                className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <img
                    src={"http://localhost:5000/" + item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-700 font-semibold">{`Price: $${item.price}`}</p>
                    <p className="text-gray-700 font-semibold">{`Quantity: ${item.qty}`}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item._id, "decrease")}
                    className="text-gray-700 hover:text-gray-900 font-semibold"
                  >
                    -
                  </button>
                  <button
                    onClick={() => updateQuantity(item._id, "increase")}
                    className="text-gray-700 hover:text-gray-900 font-semibold"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-right">
            <button
              onClick={clearCart}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCard;
