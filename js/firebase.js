// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

// Firestore
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  where,
  updateDoc,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyCND6qyK5D4k_99fKUdta1pm-JxC5GF4Wo",
    authDomain: "pyq-quiz-master.firebaseapp.com",
    projectId: "pyq-quiz-master",
    storageBucket: "pyq-quiz-master.firebasestorage.app",
    messagingSenderId: "382920239080",
    appId: "1:382920239080:web:1d739b45c3d5e011d0e65d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore Database
const db = getFirestore(app);

// Export
export {
  db,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  where,
  updateDoc,
  doc,
  onSnapshot
};
