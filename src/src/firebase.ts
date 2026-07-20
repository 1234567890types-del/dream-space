import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB6H68eQBWsMfO7AYLR6SoBv9Wm5DcvdXs",
  authDomain: "myweb-4a253.firebaseapp.com",
  databaseURL: "https://myweb-4a253-default-rtdb.firebaseio.com",
  projectId: "myweb-4a253",
  storageBucket: "myweb-4a253.firebasestorage.app",
  messagingSenderId: "464092840010",
  appId: "1:464092840010:web:07f85beed10c404911e6b3",
  measurementId: "G-9ZCWKCYQ94"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);