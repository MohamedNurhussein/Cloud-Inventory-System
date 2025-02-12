// import { admin } from "../../src/firebase/admin";
// export const handler = async (event) => {
//   try {
//     //extract items from the body
//     const { itemId, itemName, quantity } = JSON.parse(event.body);

//     //get the databse
//     const db = admin.database();

//     //get refrence to market node
//     const ref = db.ref(`market/${itemId}`);

//     //update the quantity

//     //create a new node "/users/${userId}/orders"
//     // with name and quanitty

//     return {
//       statusCode: 200,
//       body: JSON.stringify("Item Ordered Successfully"),
//     };
//   } catch (err) {
//     return {
//       statuscode: 500,
//       body: JSON.stringify("Failed to order Item: " + err),
//     };
//   }
// };
