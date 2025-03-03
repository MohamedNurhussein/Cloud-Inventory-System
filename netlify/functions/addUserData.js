import {admin} from "../../src/firebase/admin"
export const handler = async (event) => {
  try {
    //extract user data from body
    const { userId, name, email } = JSON.parse(event.body);
    console.log("on addUserDAta: ", userId, name, email)
    //initialize the db
    const db = admin.database();

    //get refrence to user's data node
    const ref = db.ref(`users/${userId}/userData`);
    await ref.set({
      name: name,
      email: email,
    });

    //return a response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify("data added successfully"),
    };
  } catch (e) {
    console.error("Failed to addUserData: ", e);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify("Failed to addUserData"),
    };
  }
};
