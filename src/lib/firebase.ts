import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA5LxOZyXTbjmPwYJda0HkL7UTsCVHZURo",
  authDomain: "luxe-93061.firebaseapp.com",
  projectId: "luxe-93061",
  storageBucket: "luxe-93061.firebasestorage.app",
  messagingSenderId: "216455503756",
  appId: "1:216455503756:web:ba22dc94413b67079f40a9",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
