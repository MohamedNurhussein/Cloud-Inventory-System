document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  const signupForm = document.getElementById("signupForm")
  const loginToggle = document.getElementById("loginToggle")
  const signupToggle = document.getElementById("signupToggle")
  const addItemBtn = document.getElementById("addItemBtn")
  const addItemModal = document.getElementById("addItemModal")
  const addItemForm = document.getElementById("addItemForm")
  const inventoryTable = document.getElementById("inventoryTable")
  const logoutBtn = document.getElementById("logoutBtn")

  let isEditing = false
  let editingRow = null

  // Toggle between login and signup forms
  if (loginToggle && signupToggle) {
    loginToggle.addEventListener("click", () => {
      loginForm.classList.add("active")
      signupForm.classList.remove("active")
      loginToggle.classList.add("active")
      signupToggle.classList.remove("active")
    })

    signupToggle.addEventListener("click", () => {
      signupForm.classList.add("active")
      loginForm.classList.remove("active")
      signupToggle.classList.add("active")
      loginToggle.classList.remove("active")
    })
  }

  // Handle form submissions
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      // Implement login logic here
      localStorage.setItem("loggedIn", "true")
      window.location.href = "dashboard.html"
    })
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()
      // Implement signup logic here
      localStorage.setItem("loggedIn", "true")
      window.location.href = "dashboard.html"
    })
  }

  // Show the modal for adding or editing an item
  function showModal(isEdit = false, row = null) {
    isEditing = isEdit
    editingRow = row

    const itemNameInput = document.getElementById("itemName")
    const itemQuantityInput = document.getElementById("itemQuantity")
    const modalTitle = addItemModal.querySelector("h2")

    if (isEdit && row) {
      modalTitle.textContent = "Edit Item"
      itemNameInput.value = row.cells[0].textContent
      itemQuantityInput.value = row.cells[1].textContent
    } else {
      modalTitle.textContent = "Add New Item"
      addItemForm.reset()
    }

    addItemModal.style.display = "block"
  }

  //check item if low stock
  function checkLowStock(row, quantity) {
    if (quantity < 5) {
      console.log("entered checkLowStock")
      row.classList.add("low-stock") // Add a warning style
    } else {
      row.classList.remove("low-stock") // Remove the warning if quantity is fine
    }
  }

  // Hide the modal
  function hideModal() {
    addItemModal.style.display = "none"
    isEditing = false
    editingRow = null
  }

  // Add item to the table
  function addInventoryItem(name, quantity) {
    const tbody = inventoryTable.querySelector("tbody")
    const row = tbody.insertRow()
    const nameCell = row.insertCell(0)
    const quantityCell = row.insertCell(1)
    const actionsCell = row.insertCell(2)
    const marketCell = row.insertCell(3)

    nameCell.textContent = name
    quantityCell.textContent = quantity

    actionsCell.innerHTML = `
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `

    marketCell.innerHTML = `
        <button class="sell-btn" onclick="openSellModal('${name}', ${quantity})">Sell on Market</button>
    `

    // Existing event listeners for edit and delete...
    checkLowStock(row, quantity)
  }

  // Update an existing item
  function updateInventoryItem(row, name, quantity) {
    row.cells[0].textContent = name
    row.cells[1].textContent = quantity
  }

  // Delete confirmation modal
  function showDeleteConfirmation(row) {
    const confirmationModal = document.createElement("div")
    confirmationModal.className = "modal"
    confirmationModal.innerHTML = `
      <div class="modal-content">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this item?</p>
        <button id="confirmDeleteBtn">Yes</button>
        <button id="cancelDeleteBtn">No</button>
      </div>
    `
    document.body.appendChild(confirmationModal)

    confirmationModal.style.display = "block"

    confirmationModal.querySelector("#confirmDeleteBtn").addEventListener("click", () => {
      row.remove()
      document.body.removeChild(confirmationModal)
    })

    confirmationModal.querySelector("#cancelDeleteBtn").addEventListener("click", () => {
      document.body.removeChild(confirmationModal)
    })
  }

  // Event listeners
  addItemBtn.addEventListener("click", () => showModal())
  addItemForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const itemName = document.getElementById("itemName").value
    const itemQuantity = document.getElementById("itemQuantity").value

    if (isEditing && editingRow) {
      checkLowStock(editingRow, itemQuantity) // Re-check stock level after editing
      updateInventoryItem(editingRow, itemName, itemQuantity)
    } else {
      addInventoryItem(itemName, itemQuantity)
    }

    hideModal()
  })

  // Update the window click event listener to check if sellModal exists
  window.addEventListener("click", (e) => {
    if (e.target === addItemModal) hideModal()
    const sellModal = document.getElementById("sellModal")
    if (sellModal && e.target === sellModal) {
      closeSellModal()
    }
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideModal()
  })

  // Logout functionality
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedIn")
      window.location.href = "index.html"
    })
  }
  // Check if user is logged in
  if (!localStorage.getItem("loggedIn") && window.location.pathname.includes("dashboard.html")) {
    window.location.href = "index.html"
  }

  function openSellModal(itemName, quantity) {
    console.log("openSellModal: we are in")
    const sellModal = document.getElementById("sellModal")
    if (!sellModal) return // Exit if modal doesn't exist

    const sellItemDetails = document.getElementById("sellItemDetails")
    const sellItemName = document.getElementById("sellItemName")
    const currentQuantity = document.getElementById("currentQuantity")
    const sellQuantity = document.getElementById("sellQuantity")

    sellItemDetails.textContent = `Item: ${itemName} (Available: ${quantity})`
    sellItemName.value = itemName
    currentQuantity.value = quantity
    sellQuantity.max = quantity
    sellQuantity.value = ""
    document.getElementById("sellPrice").value = ""
    document.getElementById("sellError").textContent = ""

    sellModal.style.display = "block"
  }
  // Attach the function to the global window object
  window.openSellModal = openSellModal;

  function closeSellModal() {
    const sellModal = document.getElementById("sellModal")
    if (sellModal) {
      sellModal.style.display = "none"
    }
  }

  // Find the sell form
  const sellForm = document.getElementById("sellForm")

  // Only add the event listener if the sell form exists (we're on the dashboard page)
  if (sellForm) {
    sellForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      const itemName = document.getElementById("sellItemName").value
      const currentQty = Number(document.getElementById("currentQuantity").value)
      const sellQty = Number(document.getElementById("sellQuantity").value)
      const price = Number(document.getElementById("sellPrice").value)
      const errorElement = document.getElementById("sellError")

      // Validate inputs
      if (sellQty <= 0 || price <= 0) {
        errorElement.textContent = "Please enter valid quantity and price"
        return
      }

      if (sellQty > currentQty) {
        errorElement.textContent = "Quantity exceeds available stock"
        return
      }

      try {
        const response = await fetch("/.netlify/functions/sellOnMarket", {
          method: "POST",
          body: JSON.stringify({
            itemName,
            price,
            quantity: sellQty,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })

        const result = await response.json()

        if (result.success) {
          // Update the inventory quantity
          const row = Array.from(inventoryTable.querySelectorAll("tbody tr")).find(
            (row) => row.cells[0].textContent === itemName,
          )

          if (row) {
            const newQuantity = currentQty - sellQty
            row.cells[1].textContent = newQuantity
            checkLowStock(row, newQuantity)
          }

          alert("Item listed on market successfully!")
          closeSellModal()
        } else {
          errorElement.textContent = result.message || "Failed to list item"
        }
      } catch (error) {
        errorElement.textContent = "An error occurred while listing the item"
        console.error("Error:", error)
      }
    })
  }
})

