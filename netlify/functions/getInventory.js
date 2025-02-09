import { admin } from "../../src/firebase/admin";

export const handler = async (event) => {
  try {
    // check if it has a body
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Request body is missing" }),
      };
    }
    //extract data from body
    const { userId } = JSON.parse(event.body);
    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing userId in request body" }),
      };
    }

    // Get the database reference
    const db = admin.database();

    // Get a reference to the user's inventory node
    const inventoryRef = db.ref(`users/${userId}/inventory`);

    // Listen for the "value" event once and get a snapshot of the data
    const snapshot = await inventoryRef.once("value");

    // Extract the data from the snapshot; default to an empty object if null
    const inventoryData = snapshot.val() || {};
    const items = Object.values(inventoryData);

    console.log("Inventory items:", items);

    return {
      statusCode: 200,
      body: JSON.stringify(items),
    };
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
