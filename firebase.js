// Get these from: Firebase Console → Project Settings → Your apps → Firebase SDK snippet
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_jXi8c--Wan69XDQShmfqEhM1jm2Ht_Q",
  authDomain: "food-d75b9.firebaseapp.com",
  projectId: "food-d75b9",
  storageBucket: "food-d75b9.firebasestorage.app",
  messagingSenderId: "91579406961",
  appId: "1:91579406961:web:fbafb258e461e5745019d0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { app, db, collection, getDocs };