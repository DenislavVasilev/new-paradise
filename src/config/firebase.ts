import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { 
  getFirestore, 
  enableIndexedDbPersistence,
  enableNetwork,
  disableNetwork,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  connectFirestoreEmulator
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Validate environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
] as const;

for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase app with error handling
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error: any) {
  console.error('Error initializing Firebase:', error);
  if (error.code === 'app/duplicate-app') {
    app = initializeApp(firebaseConfig, 'default');
  } else {
    throw new Error(`Failed to initialize Firebase: ${error.message}`);
  }
}

// Initialize Auth with persistence and error handling
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence)
  .catch(error => {
    console.error('Error setting auth persistence:', error);
    // Continue without persistence if it fails
  });

// Initialize Firestore with enhanced settings and connection retry
const initializeFirestoreWithRetry = async (retryCount = 0, maxRetries = 3) => {
  try {
    const db = initializeFirestore(app, {
      cacheSizeBytes: CACHE_SIZE_UNLIMITED,
      ignoreUndefinedProperties: true,
      experimentalForceLongPolling: true, // Force long polling for more reliable connections
    });

    // Connect to emulator if in development
    if (import.meta.env.DEV) {
      try {
        // Skip emulator connection in WebContainer environment
        const isWebContainer = typeof window !== 'undefined' && 
          window.location.hostname.includes('webcontainer');

        if (!isWebContainer) {
          connectFirestoreEmulator(db, 'localhost', 8080);
          console.log('Successfully connected to Firestore emulator');
        } else {
          console.log('Running in WebContainer - using production Firestore');
        }
      } catch (emulatorError) {
        // Log the error but continue without the emulator
        console.warn('Failed to connect to Firestore emulator:', emulatorError);
      }
    }

    // Test the connection by enabling network
    await enableNetwork(db);
    
    return db;
  } catch (error) {
    console.error(`Firestore initialization attempt ${retryCount + 1} failed:`, error);
    
    if (retryCount < maxRetries) {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
      return initializeFirestoreWithRetry(retryCount + 1, maxRetries);
    }
    
    throw error;
  }
};

// Initialize Firestore with retry mechanism
const db = await initializeFirestoreWithRetry().catch(error => {
  console.error('Failed to initialize Firestore after all retries:', error);
  throw error;
});

// Initialize Storage
const storage = getStorage(app);

// Configure offline persistence with enhanced error handling
if (typeof window !== 'undefined') {
  const setupPersistence = async () => {
    try {
      // Check if IndexedDB is available
      const indexedDB = window.indexedDB || 
                       (window as any).mozIndexedDB || 
                       (window as any).webkitIndexedDB || 
                       (window as any).msIndexedDB;
                       
      if (!indexedDB) {
        throw new Error('IndexedDB not supported in this browser');
      }

      await enableIndexedDbPersistence(db, {
        forceOwnership: false,
        synchronizeTabs: true
      });
      
      console.log('Offline persistence enabled successfully');
    } catch (err: any) {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence enabled in first tab only');
      } else if (err.code === 'unimplemented') {
        console.warn('Browser does not support persistence');
      } else {
        console.error('Error enabling persistence:', err);
        // Ensure we can still operate online
        await enableNetwork(db).catch(console.error);
      }
    }
  };

  setupPersistence();

  // Add network status monitoring
  window.addEventListener('online', () => {
    console.log('Network connection restored');
    reconnectToFirestore();
  });

  window.addEventListener('offline', () => {
    console.log('Network connection lost');
    disconnectFromFirestore();
  });
}

// Enhanced exponential backoff implementation
const getBackoffDelay = (retryCount: number): number => {
  const baseDelay = 1000; // Start with 1 second
  const maxDelay = 60000; // Max delay of 1 minute
  const exponentialDelay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
  const jitter = Math.random() * (exponentialDelay * 0.1);
  return exponentialDelay + jitter;
};

let retryCount = 0;
const MAX_RETRIES = 10;
let isReconnecting = false;
let reconnectionTimeout: NodeJS.Timeout | null = null;

export const reconnectToFirestore = async () => {
  if (isReconnecting) return;
  
  try {
    isReconnecting = true;
    
    if (reconnectionTimeout) {
      clearTimeout(reconnectionTimeout);
      reconnectionTimeout = null;
    }

    await enableNetwork(db);
    console.log('Reconnected to Firestore successfully');
    retryCount = 0;
    isReconnecting = false;
  } catch (error) {
    console.error('Error reconnecting to Firestore:', error);
    
    if (retryCount < MAX_RETRIES) {
      const delay = getBackoffDelay(retryCount);
      console.log(`Attempting to reconnect in ${Math.round(delay / 1000)} seconds...`);
      retryCount++;
      isReconnecting = false;
      
      reconnectionTimeout = setTimeout(reconnectToFirestore, delay);
    } else {
      console.error('Max retry attempts reached. Please check your connection and reload the page.');
      isReconnecting = false;
      
      // Final attempt to reset the connection
      try {
        await disableNetwork(db);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await enableNetwork(db);
      } catch (finalError) {
        console.error('Final reconnection attempt failed:', finalError);
      }
    }
  }
};

export const disconnectFromFirestore = async () => {
  try {
    if (reconnectionTimeout) {
      clearTimeout(reconnectionTimeout);
      reconnectionTimeout = null;
    }
    
    await disableNetwork(db);
    console.log('Disconnected from Firestore');
  } catch (error) {
    console.error('Error disconnecting from Firestore:', error);
  }
};

// Export initialized services
export { app, auth, db, storage };