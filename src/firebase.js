import firebase from "@firebase/app";
import "@firebase/firestore";

const config = {
  apiKey: "AIzaSyB6DiNKnwKG6Uy7cBPyy8fs3oXAP-_FohI",
  authDomain: "slip-salary-firestore.firebaseapp.com",
  databaseURL: "https://slip-salary-firestore.firebaseio.com",
  projectId: "slip-salary-firestore",
  storageBucket: "slip-salary-firestore.appspot.com",
  messagingSenderId: "383871606047",
  appId: "1:383871606047:web:5f11e236b5d9a240dae42a",
};

export default firebase.apps[0] || firebase.initializeApp(config);
