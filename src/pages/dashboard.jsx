// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import "../styles/dashboard.css";
import { useAuth } from "../context/authContext";

export default function Dashboard() {
  const { currentUser } = useAuth();

  // We'll store items as an array of [key, item] pairs.
  const [items, setItems] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(0);
  // true loading state
  const [loading, setLoading] = useState(true);

  // --- New state variables for Sell Modal ---
  const [isSellModalOpen, setSellModalOpen] = useState(false);
  const [sellPrice, setSellPrice] = useState("");
  const [sellQuantity, setSellQuantity] = useState("");
  const [sellItem, setSellItem] = useState(null);
  const [sellError, setSellError] = useState("");
  // ------------------------------------------

  useEffect(() => {
    fetchInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchInventory() {
    setLoading(true); // start loading
    try {
      console.log("on the fetching inventory");
      const res = await fetch("/.netlify/functions/getInventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.uid }),
      }).then((res) => res.json());
      // const response = await res.json();
      console.log("got a response: ", res);

      // If the response is an object, convert it to an array of [key, item] pairs.
      if (res && typeof res === "object" && !Array.isArray(res)) {
        setItems(Object.entries(res));
      } else if (Array.isArray(res)) {
        // If the res is already an array (of key/item pairs), use it directly.
        setItems(res);
      } else {
        setItems([]);
      }
      setLoading(false); // end loading
    } catch (e) {
      console.error(e);
    }
  }

  async function AddItem() {
    try {
      const res = await fetch("/.netlify/functions/addItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.uid,
          name: newItemName,
          quantity: newItemQuantity,
        }),
      });
      if (res.ok) {
        // Re-fetch the inventory to update the list.
        await fetchInventory();
        // setLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  }
  async function EditItem(key) {
    try {
      const response = await fetch("/.netlify/functions/updateItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.uid,
          itemId: key,
          title: newItemName,
          quantity: newItemQuantity,
        }),
      });
      if (response.ok) {
        console.log("updating is great, doing re fetching...");
        // re-fetch the inventory to update the table
        await fetchInventory();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function DeleteItem(key) {
    try {
      const response = await fetch("/.netlify/functions/deleteItem", {
        method: "DELETE",
        body: JSON.stringify({
          userId: currentUser.uid,
          itemId: key,
        }),
      });
      if (response.ok) {
        // re-fetch the inventory
        await fetchInventory();
      }
    } catch (err) {
      console.errror(err);
    }
  }

  async function SellItem(key) {
    try {
      const response = await fetch("/.netlify/functions/sellItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.uid,
          itemId: key,
          sellQuantity: Number(sellQuantity),
          sellPrice: Number(sellPrice),
        }),
      });
      if (response.ok) {
        //re-fetch the inventory
        await fetchInventory();
      }
    } catch (err) {
      console.error("Failed to sell item: ", err);
    }
  }

  const openAddModal = () => {
    setNewItemName("");
    setNewItemQuantity(0);
    setIsEditing(false);
    setEditingIndex(null);
    setModalOpen(true);
  };

  // Since items are key/value pairs, destructure the pair.
  const openEditModal = (index) => {
    const [key, item] = items[index];
    setNewItemName(item.name);
    setNewItemQuantity(item.quantity);
    setIsEditing(true);
    setEditingIndex(index);
    setModalOpen(true);
  };

  // --- New function for opening Sell Modal ---
  const openSellModal = (index) => {
    const [key, item] = items[index];
    // Save both key and item details for use in the sell modal.
    setSellItem({ key, ...item });
    setSellPrice("");
    setSellQuantity("");
    setSellError("");
    setSellModalOpen(true);
  };
  // ---------------------------------------------

  // When editing, preserve the original key.
  const handleAddOrEditItem = async (e) => {
    e.preventDefault();
    if (isEditing && editingIndex !== null) {
      // get copy of original array
      const updatedItems = [...items];
      // destruct the key
      const [key] = updatedItems[editingIndex];

      // update item to server-side fucntion
      await EditItem(key);
    } else {
      // add new item to server-side fucntion
      await AddItem();
    }
    setModalOpen(false);
  };

  const handleDeleteItem = (index) => {
    // destruct the key
    const [key] = items[index];
    if (window.confirm("Are you sure you want to delete this item?")) {
      // remove item from server-side function
      DeleteItem(key);
    }
  };

  async function handleSellSubmit(e) {
    e.preventDefault();
    //validate the price and quantity
    if (sellQuantity <= 0 || sellPrice <= 0) {
      setSellError("Price and quantity must be greater than zero.");
      return;
    }
    if (sellQuantity > sellItem.quantity) {
      setSellError("Sell quantity cannot exceed available stock.");
      return;
    }
    setSellError("");
    // sell item from server-side function
    await SellItem(sellItem.key);
    //close sell model
    setSellModalOpen(false);
  }

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
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan="4">
                    <div className="processing-contianer">
                      <p className="processing">Processing...</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {items.length > 0 ? (
                  items.map(([key, item], index) => (
                    <tr
                      key={key}
                      className={item.quantity < 5 ? "low-stock" : ""}
                    >
                      <td>{item.title}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <div className="actions">
                          <button
                            className="edit-btn"
                            onClick={() => openEditModal(index)}
                          >
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
                        {/* Updated Sell button to pass index so we have access to the key */}
                        <button onClick={() => openSellModal(index)}>
                          Sell
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
            )}
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

        {/* --- Sell Modal --- */}
        {isSellModalOpen && (
          <div className="modal" onClick={() => setSellModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Sell Item on Market</h2>
              {sellItem && (
                <p>
                  Listing <strong>{sellItem.title}</strong> (Available:{" "}
                  {sellItem.quantity})
                </p>
              )}
              <form onSubmit={handleSellSubmit}>
                <div className="form-group">
                  <label htmlFor="sellPrice">Price ($)</label>
                  <input
                    type="number"
                    id="sellPrice"
                    step="0.01"
                    min="0.01"
                    placeholder="Enter selling price"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="sellQuantity">Quantity to Sell</label>
                  <input
                    type="number"
                    id="sellQuantity"
                    min="1"
                    placeholder="Enter quantity"
                    value={sellQuantity}
                    onChange={(e) => setSellQuantity(e.target.value)}
                    required
                  />
                </div>
                {sellError && <p className="error-message">{sellError}</p>}
                <div className="modal-actions">
                  <button type="submit">List on Market</button>
                  <button type="button" onClick={() => setSellModalOpen(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}
