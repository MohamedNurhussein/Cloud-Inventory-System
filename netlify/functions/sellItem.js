import { admin } from "../../src/firebase/admin";
export const handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 404,
        body: JSON.stringify("Body is required"),
      };
    }

    //extract data from the body
    const { userId, itemId, sellQuantity, sellPrice } = JSON.parse(event.body);

    //get the database
    const db = admin.database();

    //get refrence to user's item node
    const itemRef = db.ref(`/users/${userId}/inventory/${itemId}`);
    //listen to once event
    const snapshot = await itemRef.once("value");
    //get title and quantity
    const [quantity, title] = Object.values(snapshot.val());

    //update the item quantity
    await itemRef.update({
      quantity: quantity - sellQuantity,
    });

    //get refrence to the market
    const marketRef = db.ref("/market");
    //push a new item
    const newItemMarketRef = marketRef.push();
    await newItemMarketRef.set({
      sellerId: userId,
      itemId: itemId,
      name: title,
      stock: sellQuantity,
      price: sellPrice,
    });

    //send a reponse back
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify("Item Listed on the Market Successfully"),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify("Failed to sell item in the market, ", err),
    };
  }
};
