// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD_4lqGsD6AhSOXbNRWWJeRsIGizW-gzY8",
    authDomain: "ev-tap-real-estate.firebaseapp.com",
    projectId: "ev-tap-real-estate",
    storageBucket: "ev-tap-real-estate.firebasestorage.app",
    messagingSenderId: "311282498758",
    appId: "1:311282498758:web:2fffd9232e346aed062bc7",
    measurementId: "G-L59TENB6WG"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app, 'evtapapp');

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

export default app;
