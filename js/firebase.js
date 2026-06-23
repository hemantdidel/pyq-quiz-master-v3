import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCND6qyK5D4k_99fKUdta1pm-JxC5GF4Wo",
  authDomain: "pyq-quiz-master.firebaseapp.com",
  projectId: "pyq-quiz-master",
  storageBucket: "pyq-quiz-master.firebasestorage.app",
  messagingSenderId: "382920239080",
  appId: "1:382920239080:web:1d739b45c3d5e011d0e65d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.db = db;
window.fb = {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDocs
};
