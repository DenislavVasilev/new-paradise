import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBiRz8kObjTT-SDOfN--Df6KkeNUU-X_SI",
  authDomain: "paradise-fbb21.firebaseapp.com",
  projectId: "paradise-fbb21",
  storageBucket: "paradise-fbb21.firebasestorage.app",
  messagingSenderId: "59784455455",
  appId: "1:59784455455:web:816eabb9f9931c64633c2a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const userId = 'YOUR_USER_ID_HERE'; // Replace with actual user ID after creating admin user

const makeUserAdmin = async () => {
  try {
    await setDoc(doc(db, 'users', userId), {
      role: 'admin',
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    console.log('User successfully updated to admin role');
  } catch (error) {
    console.error('Error updating user role:', error);
  }
};

makeUserAdmin();