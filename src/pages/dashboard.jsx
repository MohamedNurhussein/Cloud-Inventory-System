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
  //treach loading state
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchInventory() {
    setLoading(true); //sart loading
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
        //re-fetch the inventory
        await fetchInventory();
      }
    } catch (err) {
      console.errror(err);
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
      //add new item to server-side fucntion
      await AddItem();
    }
    setModalOpen(false);
  };

  const handleDeleteItem = (index) => {
    // destruct the key
    const [key] = items[index];
    if (window.confirm("Are you sure you want to delete this item?")) {
      //remove item from server-side function
      DeleteItem(key);
    }
  };

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
                        <button onClick={() => openSellModal(item)}>
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
      </main>
    </Layout>
  );
}
