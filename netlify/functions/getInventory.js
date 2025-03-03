import {admin} from "../../src/firebase/admin"
export const handler = async (event) => {
  console.log("Function started");
  try {
    console.log("Parsing event body:", event.body);
    // check if it has a body
    if (!event.body) {
      console.log("No event body found");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Request body is missing" }),
      };
    }
    
    //extract data from body
    const { userId } = JSON.parse(event.body);
    console.log("Extracted userId:", userId);
    
    if (!userId) {
      console.log("No userId found in request");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing userId in request body" }),
      };
    }

    console.log("Initializing Firebase connection");
    // Get the database reference
    const db = admin.database();
    console.log("Database reference obtained");

    // Get a reference to the user's inventory node
    const inventoryRef = db.ref(`users/${userId}/inventory`);
    console.log("Inventory reference created");

    // Listen for the "value" event once and get a snapshot of the data
    console.log("Fetching data from Firebase");
    const snapshot = await inventoryRef.once("value");
    console.log("Data fetched successfully");

    // Extract the data from the snapshot; default to an empty object if null
    const inventoryData = snapshot.val() || {};
    console.log("Inventory data:", inventoryData);
    
    const keysAndItems = Object.entries(inventoryData);
    console.log("Keys and items:", keysAndItems);

    const response = {
      statusCode: 200,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(keysAndItems),
    };
    console.log("Returning success response");
    return response;
  } catch (error) {
    console.error("Error in function:", error);
    console.error("Error stack:", error.stack);
    return {
      statusCode: 500,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ 
        error: "Internal server error", 
        message: error.message 
      }),
    };
  }
};