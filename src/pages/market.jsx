// src/pages/Market.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/market.css";

export default function Market() {
  const navigate = useNavigate();

  // Sample market items; in a real app, you might fetch these from your backend.
  const [marketItems, setMarketItems] = useState([
    { name: "Laptop", price: 999.99, stock: 50 },
    { name: "Smartphone", price: 499.99, stock: 100 },
    { name: "Tablet", price: 299.99, stock: 75 },
  ]);

  // Order modal state
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState("");
  const [orderError, setOrderError] = useState("");

  // Check authentication on mount (redirect if not logged in)
  const openOrderModal = (item) => {
    setSelectedItem(item);
    setOrderQuantity("");
    setOrderError("");
    setOrderModalVisible(true);
  };

  const closeOrderModal = () => {
    setOrderModalVisible(false);
    setOrderError("");
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    const maxStock = selectedItem.stock;
    const quantity = parseInt(orderQuantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
      setOrderError("Please enter a valid quantity");
      return;
    }
    if (quantity > maxStock) {
      setOrderError("Quantity exceeds available stock");
      return;
    }

    try {
      // Replace this simulated API call with your actual API call as needed.
      const response = await fetch("/.netlify/functions/placeOrderFromMarket", {
        method: "POST",
        body: JSON.stringify({ itemName: selectedItem.name, quantity }),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();

      if (result.success) {
        alert("Order placed successfully!");
        closeOrderModal();
        // Update the stock for the ordered item
        setMarketItems((prevItems) =>
          prevItems.map((item) =>
            item.name === selectedItem.name
              ? { ...item, stock: item.stock - quantity }
              : item
          )
        );
      } else {
        setOrderError(result.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setOrderError("An error occurred while placing the order");
    }
  };

  return (
    <Layout >
      {/* The Layout component (used across pages) already renders the consistent NavBar. */}
      <main>
        <div className="inventory-container">
          <table id="marketTable">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {marketItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.stock}</td>
                  <td>
                    <button onClick={() => openOrderModal(item)}>Order</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orderModalVisible && (
          <div className="modal" onClick={closeOrderModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Place Order</h2>
              {selectedItem && (
                <p id="itemDetails">
                  Ordering: {selectedItem.name} (Available: {selectedItem.stock})
                </p>
              )}
              <form onSubmit={handleOrderSubmit}>
                <input
                  type="number"
                  id="orderQuantity"
                  placeholder="Quantity"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(e.target.value)}
                  required
                />
                {orderError && (
                  <p id="orderError" className="error-message">
                    {orderError}
                  </p>
                )}
                <button type="submit">Place Order</button>
                <button type="button" onClick={closeOrderModal}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}
