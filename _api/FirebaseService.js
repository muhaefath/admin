// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOk560kRvPWpkPR_cR5FyWy83DPrHN0D8",
  authDomain: "apppanjar-85131.firebaseapp.com",
  projectId: "apppanjar-85131",
  storageBucket: "apppanjar-85131.appspot.com",
  messagingSenderId: "541385075162",
  appId: "1:541385075162:web:4551e602757e7d5e8a78e3",
  measurementId: "G-QYENWV2NXN", //optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
