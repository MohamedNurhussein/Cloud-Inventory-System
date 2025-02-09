// src/pages/Orders.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/orders.css";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  // On mount, check authentication and load orders from localStorage
  //   useEffect(() => {
  //     if (!localStorage.getItem("loggedIn")) {
  //       navigate("/");
  //       return;
  //     }

  //     const storedOrders = localStorage.getItem("orders");
  //     if (storedOrders) {
  //       setOrders(JSON.parse(storedOrders));
  //     }
  //   }, [navigate]);

  return (
    <Layout>
      <main>
        <div className="inventory-container orders-container">
          <table id="ordersTable">
            <thead>
              <tr>
                <th>Order Date</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.orderDate}</td>
                    <td>{order.itemName}</td>
                    <td>{order.quantity}</td>
                    <td>{order.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </Layout>
  );
}
