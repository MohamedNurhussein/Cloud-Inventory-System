// src/pages/Market.jsx
import { useState, useEffect } from "react";
import Layout from "../components/layout";
import "../styles/market.css";
import { useAuth } from "../context/authContext";

export default function Market() {
  const { currentUser } = useAuth();
  // Initialize market items with some default data if needed.
  // After fetching, these will be replaced.
  const [marketItems, setMarketItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarket();
  }, []);

  async function fetchMarket() {
    setLoading(true); // Start loading
    try {
      const response = await fetch("/.netlify/functions/fetchMarket", {
        method: "GET",
      });
      const body = await response.json();
      const responseItems = body.data;
      if (response.ok) {
        // Convert the fetched data into an array of objects.
        const items = responseItems.map(([id, item]) => ({ id, ...item }));
        setMarketItems(items);
      } else {
        console.error("Error fetching market items:", body);
      }
    } catch (err) {
      console.error("Failed to fetch market: ", err);
    } finally {
      setLoading(false); // End loading regardless of success or failure
    }
  }

  async function orderItem() {
    try {
      const response = await fetch("/.netlify/functions/orderItem", {
        method: "POST",
        body: JSON.stringify({
          id: selectedItem.id,
          userId: currentUser.uid,
          userName: currentUser.displayName,
          sellerId: selectedItem.sellerId,
          itemName: selectedItem.name,
          price: selectedItem.price,
          availableStock: selectedItem.stock,
          orderQuantity: orderQuantity,
        }),
      });
      //chech if response is ok
      if (response.ok) {
        //refetch the market
        await fetchMarket();
      }
    } catch (err) {
      console.error("Failed to order item: ", err);
    }
  }
  // Order modal state
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState("");
  const [orderError, setOrderError] = useState("");

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
    console.log("item: ", selectedItem);
    console.log("quantity: ", orderQuantity);
    //call orderItem from server-side function
    orderItem();
    closeOrderModal();
  };

  return (
    <Layout>
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
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan="4">
                    <div className="processing-contianer">
                      <p className="processing">Loading market items...</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {marketItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>{item.stock}</td>
                    <td>
                      <button onClick={() => openOrderModal(item)}>
                        Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {orderModalVisible && (
          <div className="modal" onClick={closeOrderModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Place Order</h2>
              {selectedItem && (
                <p id="itemDetails">
                  Ordering: {selectedItem.name} (Available: {selectedItem.stock}
                  )
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
