# Cloud Inventory Management System

Welcome to The Cloud Inventory Management System is a modern, cloud-based application designed to help small businesses and warehouses manage their inventory, track orders, and facilitate transactions through an online marketplace. This system leverages real-time data synchronization and serverless computing to provide an efficient and seamless experience for users.

---

## Table of Contents

* [Overview & Technical Documentation](#overview--technical-documentation)
* [User Guide / Quick Start](#user-guidequick-start)

---

## Overview & Technical Documentation

The Cloud Inventory Management System enables users to track their inventory, list products in a marketplace, and manage sales and orders efficiently. This documentation provides a detailed breakdown of the system’s architecture, features, and implementation.

### Features

- **Real-time Inventory Management**: Users can add, update, and delete inventory items.
- **Marketplace Integration**: Users can list items for sale and purchase from other sellers.
- **Order Processing**: The system manages purchases and sales with status tracking.
- **Cloud-Based Architecture**: Serverless functions handle backend processes.

### Technology Stack

- **Frontend**: React
- **Backend**: Netlify Functions
- **Database**: Firebase Realtime Database
- **Hosting**: Netlify


### System Architecture

The system employs a serverless architecture to minimize infrastructure management and optimize costs.

#### Components:

- **Frontend**: A React-based UI for inventory tracking, marketplace browsing, and order management.
- **Backend**: Netlify Functions manage API requests and business logic.
- **Database**: Firebase Realtime Database stores inventory, orders, and market data, ensuring instant updates across users.


### Implementation Details

#### Netlify Functions

Netlify Functions serve as the backend for:

- Managing inventory operations (adding, updating, and deleting items)
- Processing orders and updating sales records

#### Firebase Realtime Database

The real-time database is used for:

- Storing and synchronizing inventory, orders, and sales data.
- Ensuring instant updates across all users.


#### Deployment

The system is deployed on Netlify, leveraging:

- Continuous Deployment (CI/CD)
- Secure HTTPS connections
- Serverless backend execution


### How It Works

#### Inventory Management:

- Users can add, update, and delete items in their inventory.
- Inventory changes reflect in real-time.

#### Selling Items:

1. Users open a modal to enter stock details (quantity, price).
2. Upon confirmation:
   - Stock is deducted from inventory.
   - Item is added to the marketplace.
   - The seller ID is attached to the item.
3. The seller delivers the stock to the buyer.

#### Ordering Items:

- Buyers select items from the marketplace.
- The system checks stock availability and updates the database.
- An order is created and assigned a status (`Pending COD`, `Delivered`).
- Sales records are updated for sellers.

### Conclusion

The Cloud Inventory Management System showcases the power of cloud computing in building scalable and efficient inventory solutions. With its real-time capabilities and serverless architecture, the system provides a robust foundation for future improvements and integrations.

## User Guide / Quick Start

### [![Quick guidde](https://static.guidde.com/v0/qg%2FM7193jV9NWPKdB2VbRxun3F9yXH3%2F8URSQTre8BMUNe8Sq6YzJJ%2F9xFmeMiETaf4WcgXQvtdNs_cover.png?alt=media&token=a14786a7-a5eb-44b8-9cbc-e6954cb824e3)](https://app.guidde.com/share/playbooks/8URSQTre8BMUNe8Sq6YzJJ)

Welcome to Cloud Inventory System. This is your gateway to managing your inventory and processing sales.

### Go to [cloud-inventory-system.netlify.app](https://cloud-inventory-system.netlify.app)

### 1\. Signup or Login

Create new account or login to your account.

![Signup or Login](https://static.guidde.com/v0/qg%2FM7193jV9NWPKdB2VbRxun3F9yXH3%2F8URSQTre8BMUNe8Sq6YzJJ%2F9GvRqbgh6S46B74e4zGGiT_doc.png?alt=media&token=ed10f86a-8ac3-4d5a-9eb6-225dfe7b58e6)

### 2\. check inventory

Once logged in, you can view your inventory and all the items you currently have in stock.

![check inventory](https://static.guidde.com/v0/qg%2FM7193jV9NWPKdB2VbRxun3F9yXH3%2F8URSQTre8BMUNe8Sq6YzJJ%2Fbsj4PucbXQ5sB8BbZwv6sk_doc.png?alt=media&token=3ef37ea4-5c04-426c-9cfc-c43172d0cb72)

### 3\. plus sign

And you can add new item by clicking the plus sign.

![plus sign](https://static.guidde.com/v0/qg%2FM7193jV9NWPKdB2VbRxun3F9yXH3%2F8URSQTre8BMUNe8Sq6YzJJ%2F4KvUNKNU6bB6WEUmHdbohe_doc.png?alt=media&token=410d9053-1191-4644-9a51-9dabb167b941)

### 4\. Add Item

Here where you add detailed information for the item you wish to add

![Add Item](https://static.guidde.com/v0/qg%2FM7193jV9NWPKdB2VbRxun3F9yXH3%2F8URSQTre8BMUNe8Sq6YzJJ%2FwJUurkYHTh5QCnf1L2AzK4_doc.png?alt=media&token=57812ee2-bcef-496a-852b-c207e2e2fb32)

### 5\. Sell

By clicking the sell button you can process to sell this item.

![Click 'Sell'](https://static.guidde.com/v0/qg%2FM7193jV9NWPKdB2VbRxun3F9yXH3%2F8URSQTre8BMUNe8Sq6YzJJ%2F6DuVGtaDz3HzB65MLiRj1w_doc.png?alt=media&token=db7ec597-57f8-4fa8-9d3f-28d84d117c00)

### 6\. list on market

Enter the price and quantity of the item and list it in the market.

![list on market](https://static.guidde.com/v0/qg%2FM7193jV9NWPKdB2VbRxun3F9yXH3%2F8URSQTre8BMUNe8Sq6YzJJ%2FeeBH4A6ApN4abXYFdzSa5K_doc.png?alt=media&token=614a6ffe-5f08-4257-ac50-60e88e02aa7d)

### 7\. navigate to market

Access the market section.

![navigate to market](https://static.guidde.com/v0/qg%2FM7193jV9NWPKdB2VbRxun3F9yXH3%2F8URSQTre8BMUNe8Sq6YzJJ%2FiyZ3oG34HhR3BxFBytHeso_doc.png?alt=media&token=af22efa1-ef98-4ec3-a4c8-820599b2e182)

### 8\. view market

Here, you can view and order items that have been listed by other sellers in the market.

![view market](https://static.guidde.com/v0/qg%2FM7193jV9NWPKdB2VbRxun3F9yXH3%2F8URSQTre8BMUNe8Sq6YzJJ%2Fqsx23D6Qioa7tfxGLqUzTn_doc.png?alt=media&token=26d71d10-acaf-42fa-97ac-b3fff1947c5a)

### 9\. Order

If you wish to order a specific item, click the order button.

![Order](https://static.guidde.com/v0/qg%2FM7193jV9NWPKdB2VbRxun3F9yXH3%2F8URSQTre8BMUNe8Sq6YzJJ%2F72dDaZNV7reyPn8XTbDPXc_doc.png?alt=media&token=59c35ca9-3b1f-45b5-a60c-4c23e914eccb)

### 10\. Place Order

You can enter the quantity you wish to order and proceed to place your order.

![Place Order](https://static.guidde.com/v0/qg%2FM7193jV9NWPKdB2VbRxun3F9yXH3%2F8URSQTre8BMUNe8Sq6YzJJ%2FoxqqxBzJYZw2eyfVA2bESH_doc.png?alt=media&token=36d64e5b-105b-484d-9950-0269f444af21)

### 11\. navigate to Activity

Access the activity section.

![navigate to Activity](https://static.guidde.com/v0/qg%2FM7193jV9NWPKdB2VbRxun3F9yXH3%2F8URSQTre8BMUNe8Sq6YzJJ%2F8rFLBdwAUhUhk5rHnbF1sf_doc.png?alt=media&token=4041dd2a-79b2-4908-a8f4-e800ff935214)

### 12\. your orders history

Where you can view your order history

![your orders history](https://static.guidde.com/v0/qg%2FM7193jV9NWPKdB2VbRxun3F9yXH3%2F8URSQTre8BMUNe8Sq6YzJJ%2FtxgzuB1e8bmVcFwb5trSwp_doc.png?alt=media&token=fcc43e7c-6b9a-4dff-9e46-3b60926caa15)

### 13\. your sales history

And if you are a seller, you can view your sales history by navigating to the "Your sales" button.

![your sales history](https://static.guidde.com/v0/qg%2FM7193jV9NWPKdB2VbRxun3F9yXH3%2F8URSQTre8BMUNe8Sq6YzJJ%2FmWH275iUT3tfNEDTQKiuRT_doc.png?alt=media&token=d9fb97e4-0151-49b4-a8d7-5b3cdf17b182)
