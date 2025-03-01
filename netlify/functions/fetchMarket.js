import { admin } from "../../src/firebase/admin";
export const handler = async () => {
  try {
    //get database
    const db = admin.database();

    //get refrence to market node
    const MarketRef = db.ref("/market");

    //listen to once event once
    const snapshot = await MarketRef.once("value");

    //turn the object into an array
    const MarketItems = Object.entries(snapshot.val());

    //return a response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Market Fetched Successfully",
        data: MarketItems,
      }),
    };
  } catch (err) {
    console.error("Failed fetching market: ", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify("Failed fetch Market: ", err),
    };
  }
};
