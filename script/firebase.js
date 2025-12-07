// ============================
//   LK NET CENTRE POS - FIREBASE CONFIG (v8)
// ============================

// Your Firebase config (same keys you provided)
const firebaseConfig = {
  apiKey: "AIzaSyAq6bTe83E3u7zYfhOuegqNIwwSws4fGo0",
  authDomain: "pos-web-9613b.firebaseapp.com",
  projectId: "pos-web-9613b",
  storageBucket: "pos-web-9613b.appspot.com",
  messagingSenderId: "371044884744",
  appId: "1:371044884744:web:fdb02d35f38d0787058cbd"
};

// Initialize Firebase (v8)
firebase.initializeApp(firebaseConfig);

// Auth + Firestore setup
const auth = firebase.auth();
const db   = firebase.firestore();

// Offline support + multi-tab sync
db.enablePersistence({ synchronizeTabs: true }).catch(err => {
    console.warn("Offline support not available:", err.code);
});
