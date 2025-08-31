// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-lwwhqj8b-zuBryx-LjSSeYEZZBjlZWM",
  authDomain: "runit-dc3f0.firebaseapp.com",
  projectId: "runit-dc3f0",
  storageBucket: "runit-dc3f0.firebasestorage.app",
  messagingSenderId: "70227203880",
  appId: "1:70227203880:web:b660760d50a63a210ae21d",
  measurementId: "G-WMBS12Y57F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
