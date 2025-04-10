// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";




const firebaseConfig = {
    apiKey: "AIzaSyAZyC4-6A4RDY2jM6P7Sp_iVC8cMnJ5tFs",
    authDomain: "prepmebuddy-2516f.firebaseapp.com",
    projectId: "prepmebuddy-2516f",
    storageBucket: "prepmebuddy-2516f.firebasestorage.app",
    messagingSenderId: "468316661238",
    appId: "1:468316661238:web:0dabebcb8601c29b35d3d7",
    measurementId: "G-LPGKP388MP"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
