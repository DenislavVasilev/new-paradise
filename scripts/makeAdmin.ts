import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDAVTLJ8CLeiox7xoK2y5ZdXE2y5VIoKY8",
  authDomain: "vqtarna-melnica.firebaseapp.com",
  projectId: "vqtarna-melnica",
  storageBucket: "vqtarna-melnica.firebasestorage.app",
  messagingSenderId: "791540456402",
  appId: "1:791540456402:web:4bf6110752823417ac860b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const userId = 'jHmeuM5Q5pUXOG80JPY5QWC2oPh1';

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