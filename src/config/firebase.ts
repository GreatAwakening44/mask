import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAk4_3zs3EuWMikUHqnhdCyMhBvqkEfanM",
  authDomain: "mask-b416d.firebaseapp.com",
  projectId: "mask-b416d",
  storageBucket: "mask-b416d.firebasestorage.app",
  messagingSenderId: "535693277936",
  appId: "1:535693277936:web:fb18495ac96f115a23a035"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)