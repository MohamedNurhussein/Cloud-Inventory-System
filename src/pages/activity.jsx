import { useState, useEffect } from "react";
 import Layout from "../components/layout";
import "../styles/orders.css";
import { useAuth } from "../context/authContext";

export default function Activity() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    fetchUserActivity();
  }, []);

  async function fetchUserActivity() {
    setLoading(true);
    try {
      // Fetch orders
      const ordersResponse = await fetch(
        "/.netlify/functions/fetchUserOrders",
        {
          method: "POST",
          body: JSON.stringify({ userId: currentUser.uid }),
        }
      );

      // Fetch sales
      const salesResponse = await fetch("/.netlify/functions/fetchUserSales", {
        method: "POST",
        body: JSON.stringify({ userId: currentUser.uid }),
      });

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        const formattedOrders = ordersData.data.map(([id, order]) => ({
          id,
          itemName: order.itemName,
          sellerName: order.sellerName,
          totalPrice: order.totalPrice,
          orderDate: new Date(order.orderTime).toLocaleString(),
          status: order.status,
          // quantity: order.quantity || 1,
        }));
        setOrders(formattedOrders);
      }

      if (salesResponse.ok) {
        const salesData = await salesResponse.json();
        const formattedSales = salesData.data.map(([id, sale]) => ({
          id,
          itemName: sale.itemName,
          buyerName: sale.buyerName,
          totalPrice: sale.totalPrice,
          orderDate: new Date(sale.orderTime).toLocaleString(),
          status: sale.status,
          // quantity: sale.quantity || 1,
        }));
        setSales(formattedSales);
      }
    } catch (err) {
      console.error("Failed to fetch activity data:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Layout>
      <main>
        <div className="tab-container">
          <button
            className={`tab-button ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => handleTabChange("orders")}
          >
            Your Orders
          </button>
          <button
            className={`tab-button ${activeTab === "sales" ? "active" : ""}`}
            onClick={() => handleTabChange("sales")}
          >
            Your Sales
          </button>
        </div>

        <div className="inventory-container orders-container">
          {loading ? (
            <div className="processing-container">
              <p className="processing">Loading activity data...</p>
            </div>
          ) : (
            <>
              {activeTab === "orders" && (
                <div className="tab-content">
                  <h2>Your Orders</h2>
                  <table id="ordersTable">
                    <thead>
                      <tr>
                        <th>Order Date</th>
                        <th>Item Name</th>
                        <th>Seller</th>
                        <th>Price</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <tr key={order.id}>
                            <td>{order.orderDate}</td>
                            <td>{order.itemName}</td>
                            <td>{order.sellerName}</td>
                            <td>${order.totalPrice.toFixed(2)}</td>
                            <td>{order.status}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No orders found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "sales" && (
                <div className="tab-content">
                  <h2>Your Sales</h2>
                  <table id="salesTable">
                    <thead>
                      <tr>
                        <th>Sale Date</th>
                        <th>Item Name</th>
                        <th>Buyer</th>
                        <th>Price</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.length > 0 ? (
                        sales.map((sale) => (
                          <tr key={sale.id}>
                            <td>{sale.orderDate}</td>
                            <td>{sale.itemName}</td>
                            <td>{sale.buyerName}</td>
                            <td>${sale.totalPrice.toFixed(2)}</td>
                            <td>{sale.status}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No sales found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </Layout>
  );
}
