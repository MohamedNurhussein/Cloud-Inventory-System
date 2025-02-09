import dotenv from "dotenv";
dotenv.config(); // load environment variables

// var serviceAccount = require("path/to/serviceAccountKey.json");
import admin from "firebase-admin";
import serviceAccout from "../../serviceAccount.json"
// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
      credential: admin.credential.cert(serviceAccout),
      databaseURL:
      "https://inventory-management-sys-5ff0c-default-rtdb.europe-west1.firebasedatabase.app",
    });
}

export { admin };

// admin.initializeApp({});


// credential: admin.credential.cert({
//   project_id: process.env.FIREBASE_PROJECT_ID,
//   private_key: process.env.FIREBASE_PRIVATE_KEY,
//   client_email: process.env.FIREBASE_CLIENT_EMAIL,
// }),
// databaseURL: process.env.FIREBASE_URL,
