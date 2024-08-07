// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjBxxiPHdd699lyktQrrRTaCEqYmWoVNY",
  authDomain: "fridge-37a01.firebaseapp.com",
  projectId: "fridge-37a01",
  storageBucket: "fridge-37a01.appspot.com",
  messagingSenderId: "762338046120",
  appId: "1:762338046120:web:aad45641018561eafdd29d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);