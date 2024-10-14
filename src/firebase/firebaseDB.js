// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBe0cZrcw8SsUarGX9Kd2wWCincgadKRuQ",
    authDomain: "taskmanager-255b6.firebaseapp.com",
    projectId: "taskmanager-255b6",
    storageBucket: "taskmanager-255b6.appspot.com",
    messagingSenderId: "262318413907",
    appId: "1:262318413907:web:29006845b50a6d04c5cea6",
    measurementId: "G-GZH0QPE948"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
