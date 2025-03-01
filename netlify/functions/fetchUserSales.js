import { admin } from "../../src/firebase/admin";
export const handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Event body is required" }),
      };
    }
    //extract userId from body
    const { userId } = JSON.parse(event.body);
    
    //get the database
    const db = admin.database();

    //get a refrence to the sales node
    const salesRef = db.ref(`users/${userId}/sales`);

    //listen to once event
    const snapshot = await salesRef.once("value");

    //convert the object to an array
    const sales = Object.entries(snapshot.val());
    
    //return a response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "sales fetched successfully",
        data: sales,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify("Error occurred while fetching user sales: ", err),
    };
  }
};
