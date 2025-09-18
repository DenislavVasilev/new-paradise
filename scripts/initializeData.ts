import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBiRz8kObjTT-SDOfN--Df6KkeNUU-X_SI",
  authDomain: "paradise-fbb21.firebaseapp.com",
  projectId: "paradise-fbb21",
  storageBucket: "paradise-fbb21.firebasestorage.app",
  messagingSenderId: "59784455455",
  appId: "1:59784455455:web:816eabb9f9931c64633c2a"
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