import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKUSDiVLKQrmBk1mYcbtmqjAG5Qjum08U",
  authDomain: "study-companion-8ebf9.firebaseapp.com",
  projectId: "study-companion-8ebf9",
  storageBucket: "study-companion-8ebf9.firebasestorage.app",
  messagingSenderId: "455779365632",
  appId: "1:455779365632:web:d17e6406ec3160d4b8b9e5"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);