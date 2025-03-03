import {admin} from "../../src/firebase/admin"
// import { db } from "../../src/firebase/firebase";
export const handler = async function (event) {
  try {
    //get db
    const db = admin.database();

    ///users/{userId}/inventory
    const { userId, name, quantity } = JSON.parse(event.body);
    console.log("inside handler with: ", userId, name, quantity);

    //get reference to inventory item
    const ref = db.ref(`users/${userId}/inventory`);
    const inventoryRef = ref.push();
    await inventoryRef.set({
      title: name,
      quantity: quantity,
    });

    //return a response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      response: "ok",
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(console.log(err)),
    };
  }
};
