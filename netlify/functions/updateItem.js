import { admin } from "../../src/firebase/admin";
export const handler = async (event) => {
  try {
    //users/${userId}/inventory/{itemId}
    //extract item data from body
    const { userId, itemId, title, quantity } = JSON.parse(event.body);

    console.log("got items: ", userId, itemId, title, quantity);
    //get the database
    const db = admin.database();

    //get refrence to user's item node
    const ref = db.ref(`/users/${userId}/inventory/${itemId}`);

    //update the values
    await ref.update({
      title: title,
      quantity: quantity,
    });

    return {
      statusCode: 200,
      body: JSON.stringify("item updated successfully"),
    };
  } catch (err) {
    console.error("Failed to update item: ", err);
    return null;
  }
};
