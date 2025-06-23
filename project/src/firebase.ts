import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCq-CPy2JtfuduA5xgVyuMLtlAKk4I1I6A",
  authDomain: "autopolicy-afcb3.firebaseapp.com",
  projectId: "autopolicy-afcb3",
  storageBucket: "autopolicy-afcb3.appspot.com",
  messagingSenderId: "27951306700",
  appId: "1:27951306700:web:d1d418a12e60858c38ef69",
  measurementId: "G-PJM73XFEPY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);