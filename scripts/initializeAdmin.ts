import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const userId = process.env.ADMIN_USER_ID; // Set this in your environment

const makeUserAdmin = async () => {
  if (!userId) {
    console.error('Error: ADMIN_USER_ID environment variable not set');
    process.exit(1);
  }

  try {
    await setDoc(doc(db, 'users', userId), {
      role: 'admin',
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    console.log('User successfully updated to admin role');
  } catch (error) {
    console.error('Error updating user role:', error);
    process.exit(1);
  }
};

makeUserAdmin();