// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBtOxrUTwA-wTVeQWEmQySVE-i4OWIyjOo",
	authDomain: "affordify-a7de7.firebaseapp.com",
	projectId: "affordify-a7de7",
	storageBucket: "affordify-a7de7.appspot.com",
	messagingSenderId: "619418545219",
	appId: "1:619418545219:web:4858e710fb619453d7f8f6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// DB
const db = getFirestore(app);
const usersCol = collection(db, "users");

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { app, db, collection, usersCol, auth };
