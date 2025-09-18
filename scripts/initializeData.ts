import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const apartments = [
  {
    number: "101",
    entrance: "1",
    floor: 1,
    type: "2-bedroom",
    rooms: 2,
    area: 75.5,
    price: 165000,
    status: "available",
    description: "Просторен двустаен апартамент с южно изложение",
    features: [
      "Южно изложение",
      "Просторна тераса",
      "Луксозни довършителни работи",
      "Подово отопление"
    ]
  },
  {
    number: "102",
    entrance: "1",
    floor: 1,
    type: "3-bedroom",
    rooms: 3,
    area: 95.8,
    price: 210000,
    status: "available",
    description: "Луксозен тристаен апартамент с панорамна гледка",
    features: [
      "Панорамна гледка",
      "Две бани",
      "Гардеробна",
      "Подово отопление"
    ]
  }
];

const parkingSpots = [
  {
    number: "P01",
    floor: -1,
    type: "covered",
    size: "2.5m x 5m",
    price: 15000,
    status: "available"
  },
  {
    number: "P02",
    floor: -1,
    type: "covered",
    size: "2.5m x 5m",
    price: 15000,
    status: "available"
  }
];

const initializeData = async () => {
  try {
    // Add apartments
    for (const apartment of apartments) {
      await addDoc(collection(db, 'apartments'), {
        ...apartment,
        createdAt: new Date()
      });
      console.log(`Added apartment ${apartment.number}`);
    }

    // Add parking spots
    for (const spot of parkingSpots) {
      await addDoc(collection(db, 'parkingSpots'), {
        ...spot,
        createdAt: new Date()
      });
      console.log(`Added parking spot ${spot.number}`);
    }

    console.log('Successfully initialized data');
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

initializeData();