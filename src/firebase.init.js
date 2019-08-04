
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC2_sHO4--eMTdP6sBlxQBtu97EZOCvZ5Y",
  authDomain: "mitrmoji.firebaseapp.com",
  databaseURL: "https://mitrmoji.firebaseio.com",
  projectId: "mitrmoji",
  storageBucket: "mitrmoji.appspot.com",
  messagingSenderId: "751769084220",
  appId: "1:751769084220:web:16cdcc317638a4e4"
};

firebase.initializeApp(firebaseConfig);

export default firebase;