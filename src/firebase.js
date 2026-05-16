import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjxv5hwZNQ_oLozfL_MogftWzyxuSAhB8",
  authDomain: "billveil.firebaseapp.com",
  projectId: "billveil",
  storageBucket: "billveil.firebasestorage.app",
  messagingSenderId: "848449111660",
  appId: "1:848449111660:web:696597845d46617fda7a49",
  measurementId: "G-Y1PRV366T4",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, { experimentalForceLongPolling: true }, "default");
export const projectId = firebaseConfig.projectId;
