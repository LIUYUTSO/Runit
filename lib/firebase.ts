import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyA-lwwhqj8b-zuBryx-LjSSeYEZZBjlZWM",
  authDomain: "runit-dc3f0.firebaseapp.com",
  projectId: "runit-dc3f0",
  storageBucket: "runit-dc3f0.firebasestorage.app",
  messagingSenderId: "70227203880",
  appId: "1:70227203880:web:b660760d50a63a210ae21d",
  measurementId: "G-WMBS12Y57F"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Auth
export const auth = getAuth(app)

export default app
