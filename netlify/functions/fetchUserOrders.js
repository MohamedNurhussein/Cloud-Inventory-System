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

    //get refrence to orders node
    const ordersRef = db.ref(`users/${userId}/orders`);

    //listen to once event
    const snapshot = await ordersRef.once("value");

    //turn the object into an array
    const orders = Object.entries(snapshot.val());

    //return a response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "fetched user orders successfully",
        data: orders,
      }),
    };
  } catch (err) {
    return {
      statuscode: 500,
      body: JSON.stringify("Error occurred while fetching user orders: " + err),
    };
  }
};
