// firebase.js
import { firebase } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBe0cZrcw8SsUarGX9Kd2wWCincgadKRuQ",
  authDomain: "taskmanager-255b6.firebaseapp.com",
  projectId: "taskmanager-255b6",
  storageBucket: "taskmanager-255b6.appspot.com",
  messagingSenderId: "262318413907",
  appId: "1:262318413907:web:29006845b50a6d04c5cea6",
  measurementId: "G-GZH0QPE948"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { auth };
