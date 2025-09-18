import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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
const auth = getAuth(app);
const db = getFirestore(app);

const createAdminUser = async () => {
  const email = 'denislav@reachub.co'; // Change this to your desired admin email
  const password = 'da1da2da3'; // Change this to a secure password

  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('Admin user created successfully!');
    console.log('User ID:', user.uid);
    console.log('Email:', user.email);
    
    // Set admin role in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      role: 'admin',
      email: user.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log('Admin role assigned successfully!');
    console.log('You can now login with:', email);
    
  } catch (error: any) {
    console.error('Error creating admin user:', error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('Email already exists. If you need to reset the password, do it through Firebase Console.');
    }
  }
};

createAdminUser();