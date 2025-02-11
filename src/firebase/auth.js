import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

//signup
export const signup = async (name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    //update display name
    await updateProfile(user, {
      displayName: name,
    });
    return user;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};
//login
export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error.message);
    return error.message
  }
};

//logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log(error.message);
  }
};
