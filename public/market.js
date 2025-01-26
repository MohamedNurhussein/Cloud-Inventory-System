document.addEventListener("DOMContentLoaded", () => {
    // Check authentication
    if (!localStorage.getItem("loggedIn")) {
      window.location.href = "index.html"
      return
    }
  
    const marketTable = document.getElementById("marketTable")
    const orderModal = document.getElementById("orderModal")
    const orderForm = document.getElementById("orderForm")
    const logoutBtn = document.getElementById("logoutBtn")
  
    // Sample market data (replace with actual data from your backend)
    const marketItems = [
      { name: "Laptop", price: 999.99, stock: 50 },
      { name: "Smartphone", price: 499.99, stock: 100 },
      { name: "Tablet", price: 299.99, stock: 75 },
    ]
  
    // Populate market table
    function populateMarketTable() {
      const tbody = marketTable.querySelector("tbody")
      tbody.innerHTML = ""
  
      marketItems.forEach((item) => {
        const row = tbody.insertRow()
        row.innerHTML = `
                  <td>${item.name}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>${item.stock}</td>
                  <td><button onclick="openOrderModal('${item.name}', ${item.stock})">Order</button></td>
              `
      })
    }
  
    // Open order modal
    window.openOrderModal = (itemName, stock) => {
      const itemDetails = document.getElementById("itemDetails")
      const orderItemName = document.getElementById("orderItemName")
      const orderMaxStock = document.getElementById("orderMaxStock")
      const orderQuantity = document.getElementById("orderQuantity")
  
      itemDetails.textContent = `Ordering: ${itemName} (Available: ${stock})`
      orderItemName.value = itemName
      orderMaxStock.value = stock
      orderQuantity.max = stock
      orderQuantity.value = ""
  
      orderModal.style.display = "block"
    }
  
    // Close order modal
    window.closeOrderModal = () => {
      orderModal.style.display = "none"
      document.getElementById("orderError").textContent = ""
    }
  
    // Handle order submission
    orderForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      const itemName = document.getElementById("orderItemName").value
      const maxStock = Number.parseInt(document.getElementById("orderMaxStock").value)
      const quantity = Number.parseInt(document.getElementById("orderQuantity").value)
      const errorElement = document.getElementById("orderError")
  
      if (quantity <= 0) {
        errorElement.textContent = "Please enter a valid quantity"
        return
      }
  
      if (quantity > maxStock) {
        errorElement.textContent = "Quantity exceeds available stock"
        return
      }
  
      try {
        const response = await fetch("/.netlify/functions/placeOrderFromMarket", {
          method: "POST",
          body: JSON.stringify({
            itemName,
            quantity,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
  
        const result = await response.json()
  
        if (result.success) {
          alert("Order placed successfully!")
          closeOrderModal()
          // Refresh market data
          // In a real application, you would fetch updated data from the server
          populateMarketTable()
        } else {
          errorElement.textContent = result.message || "Failed to place order"
        }
      } catch (error) {
        errorElement.textContent = "An error occurred while placing the order"
        console.error("Error:", error)
      }
    })
  
    // Logout functionality
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedIn")
      window.location.href = "index.html"
    })
  
    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === orderModal) {
        closeOrderModal()
      }
    })
  
    // Initialize market table
    populateMarketTable()
  })
  
  