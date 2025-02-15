import { admin } from "../../src/firebase/admin";
export const handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Event body is required" }),
      };
    }
    //extract items from the body
    const {
      id,
      userId,
      userName,
      sellerId,
      itemName,
      price,
      availableStock,
      orderQuantity,
    } = JSON.parse(event.body);

    //get the databse
    const db = admin.database();

    //get the totlat pice
    const totalPrice = price * orderQuantity;

    //get refrence to market node
    const MarketRef = db.ref(`market/${id}`);

    // update the stock
    await MarketRef.update({
      stock: availableStock - orderQuantity,
    });

    //get seller name
    const sellerRef = db.ref(`users/${sellerId}/userData`);
    const snapshot = await sellerRef.once("value");
    const [email, sellerName] = Object.values(snapshot.val());

    //get timestamp
    const timestamp = admin.database.ServerValue.TIMESTAMP;

    // create order for buyer
    const buyerRef = db.ref(`users/${userId}/orders`);
    const orderRef = await buyerRef.push();
    await orderRef.set({
      itemName: itemName,
      sellerName: sellerName,
      totalPrice: totalPrice,
      orderTime: timestamp,
      status: "Pending COD",
    });

    //create order for saler
    const SalerRef = db.ref(`users/${sellerId}/sales`);
    const salesRef = await SalerRef.push();
    salesRef.set({
      itemName: itemName,
      buyerName: userName,
      totalPrice: totalPrice,
      orderTime: timestamp,
      status: "Pending COD",
    });

    return {
      statusCode: 200,
      body: JSON.stringify("Item Ordered Successfully"),
    };
  } catch (err) {
    return {
      statuscode: 500,
      body: JSON.stringify("Failed to order Item: " + err),
    };
  }
};
