import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyDsfb1kKHE6OPr3_-bSKds596_jflwrGQs',
  authDomain: 'whatsapp-b4f8d.firebaseapp.com',
  projectId: 'whatsapp-b4f8d',
  storageBucket: 'whatsapp-b4f8d.appspot.com',
  messagingSenderId: '678559267258',
  appId: '1:678559267258:web:16af51feeb9398e44f4583',
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
