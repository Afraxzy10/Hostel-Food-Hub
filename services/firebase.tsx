
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVFFg-V_c5t2AzavHV73u26lHxi6tk-QI",
  authDomain: "hostel-food-hub.firebaseapp.com",
  projectId: "hostel-food-hub",
  storageBucket: "hostel-food-hub.firebasestorage.app",
  messagingSenderId: "1025000089037",
  appId: "1:1025000089037:web:e5a194dbe91b44ee281084"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);
