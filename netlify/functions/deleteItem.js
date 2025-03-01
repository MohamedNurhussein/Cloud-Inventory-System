import { admin } from "../../src/firebase/admin";
export const handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 404,
        body: JSON.stringify("request body is required"),
      };
    }
    //extract data from body
    const { userId, itemId } = JSON.parse(event.body);

    //get the database()
    const db = admin.database();

    //get refrence to user's item node
    const ref = db.ref(`/users/${userId}/inventory/${itemId}`);

    //delete that node
    await ref.remove()

    //return a response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify("item deleted successfully"),
    };
  } catch (err) {
    console.error("Failed to delete item: ", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify("failed to delete item"),
    };
  }
};
