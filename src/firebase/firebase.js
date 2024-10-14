import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAs5DcYxXNMwkzfw0NLnqidZwly4FKsXD0",
  authDomain: "taskmanager-86407.firebaseapp.com",
  projectId: "taskmanager-86407",
  storageBucket: "taskmanager-86407.appspot.com",
  messagingSenderId: "568453445836",
  appId: "1:568453445836:web:4cb4639573d04b66936a69",
  measurementId: "G-C376YR33CW"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export { auth };
