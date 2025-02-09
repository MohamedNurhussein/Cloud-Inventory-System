// src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/dashboard.css";
import { useAuth } from "../context/authContext";
export default function Dashboard() {
  const { currentUser } = useAuth();
  // Initialize with a dummy item so TS can infer the shape.
  const [items, setItems] = useState([{ name: "", quantity: 0 }]);
  // Immediately clear the dummy value once the component mounts.
  useEffect(() => {
    async function fetchInventory() {
      try {
        const response = await fetch("/.netlify/functions/getInventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUser.uid }),
        }).then((res) => res.json());

        console.log("response: ", response);
        setItems(response);
      } catch (e) {
        console.error(e);
      }
    }
    fetchInventory();
  }, [items]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // Here, editingIndex is either a number or null.
  const [editingIndex, setEditingIndex] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(0);

  const navigate = useNavigate();

  const openAddModal = () => {
    setNewItemName("");
    setNewItemQuantity(0);
    setIsEditing(false);
    setEditingIndex(null);
    setModalOpen(true);
    console.log("...items:openModel, ", ...items);
  };

  const openEditModal = (index) => {
    const item = items[index];
    setNewItemName(item.name);
    setNewItemQuantity(item.quantity);
    setIsEditing(true);
    setEditingIndex(index);
    setModalOpen(true);
  };

  const handleAddOrEditItem = async (e) => {
    e.preventDefault();
    if (isEditing && editingIndex !== null) {
      // Update the existing item
      const updatedItems = [...items];
      updatedItems[editingIndex] = {
        name: newItemName,
        quantity: newItemQuantity,
      };
      setItems(updatedItems);
    } else {
      //request addItem function
      try {
        const response = await fetch("/.netlify/functions/addItem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.uid,
            name: newItemName,
            quantity: newItemQuantity,
          }),
        });
        console.log("did the fetch, ", response);
      } catch (err) {
        console.error(err);
      }
      console.log("added something");
      // Add a new item to the list
      // setItems([...items, { name: newItemName, quantity: newItemQuantity }]);
    }
    console.log("...items: ", ...items);
    setModalOpen(false);
  };

  const handleDeleteItem = (index) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // A placeholder for the Sell Modal functionality.
  const openSellModal = (item) => {
    console.log(
      `Sell modal requested for "${item.name}" (Available: ${item.quantity})`
    );
    alert(`Sell modal not implemented for "${item.name}"`);
  };

  return (
    <Layout>
      <main className="everything">
        <h2 id="welcomeMessage">Hello, {currentUser.displayName}</h2>
        <div className="inventory-container">
          <table id="inventoryTable">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Actions</th>
                <th>Market</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr
                    key={index}
                    className={item.quantity < 5 ? "low-stock" : ""}
                  >
                    <td>{item.title}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <div className="actions">
                        <button onClick={() => openEditModal(index)}>
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteItem(index)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                    <td>
                      <button
                        className="sell-btn"
                        onClick={() => openSellModal(item)}
                      >
                        Sell on Market
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button id="addItemBtn" className="floating-btn" onClick={openAddModal}>
          +
        </button>

        {isModalOpen && (
          <div className="modal" onClick={() => setModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{isEditing ? "Edit Item" : "Add New Item"}</h2>
              <form onSubmit={handleAddOrEditItem}>
                <input
                  type="text"
                  id="itemName"
                  placeholder="Item Name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  required
                />
                <input
                  type="number"
                  id="itemQuantity"
                  placeholder="Quantity"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(Number(e.target.value))}
                  required
                />
                <button type="submit">
                  {isEditing ? "Update Item" : "Add Item"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}
