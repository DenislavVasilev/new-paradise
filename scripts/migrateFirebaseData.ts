import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, listAll, getDownloadURL, uploadBytes } from 'firebase/storage';

// Конфигурация на стария проект
const oldFirebaseConfig = {
  apiKey: "OLD_API_KEY",
  authDomain: "OLD_AUTH_DOMAIN",
  projectId: "OLD_PROJECT_ID",
  storageBucket: "OLD_STORAGE_BUCKET",
  messagingSenderId: "OLD_MESSAGING_SENDER_ID",
  appId: "OLD_APP_ID"
};

// Конфигурация на новия проект
const newFirebaseConfig = {
  apiKey: "NEW_API_KEY",
  authDomain: "NEW_AUTH_DOMAIN",
  projectId: "NEW_PROJECT_ID",
  storageBucket: "NEW_STORAGE_BUCKET",
  messagingSenderId: "NEW_MESSAGING_SENDER_ID",
  appId: "NEW_APP_ID"
};

// Инициализиране на двата проекта
const oldApp = initializeApp(oldFirebaseConfig, 'old');
const newApp = initializeApp(newFirebaseConfig, 'new');

const oldDb = getFirestore(oldApp);
const newDb = getFirestore(newApp);

const oldStorage = getStorage(oldApp);
const newStorage = getStorage(newApp);

// Колекции за копиране
const collectionsToMigrate = [
  'apartments',
  'parkingSpots',
  'floorPlans',
  'stores',
  'contacts',
  'media',
  'users'
];

async function migrateFirestoreData() {
  console.log('Започване на миграция на Firestore данни...');
  
  for (const collectionName of collectionsToMigrate) {
    try {
      console.log(`Копиране на колекция: ${collectionName}`);
      
      const oldCollectionRef = collection(oldDb, collectionName);
      const snapshot = await getDocs(oldCollectionRef);
      
      const batch = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const newDocRef = doc(newDb, collectionName, docSnapshot.id);
        batch.push(setDoc(newDocRef, data));
      });
      
      await Promise.all(batch);
      console.log(`✅ Копирани ${snapshot.size} документа от ${collectionName}`);
      
    } catch (error) {
      console.error(`❌ Грешка при копиране на ${collectionName}:`, error);
    }
  }
}

async function migrateStorageFiles() {
  console.log('Започване на миграция на Storage файлове...');
  
  const foldersToMigrate = [
    'apartments',
    'floorPlans',
    'stores',
    'parking',
    'media'
  ];
  
  for (const folder of foldersToMigrate) {
    try {
      console.log(`Копиране на папка: ${folder}`);
      
      const oldFolderRef = ref(oldStorage, folder);
      const fileList = await listAll(oldFolderRef);
      
      for (const fileRef of fileList.items) {
        try {
          // Изтегляне на файла от стария проект
          const downloadUrl = await getDownloadURL(fileRef);
          const response = await fetch(downloadUrl);
          const blob = await response.blob();
          
          // Качване във новия проект
          const newFileRef = ref(newStorage, fileRef.fullPath);
          await uploadBytes(newFileRef, blob);
          
          console.log(`✅ Копиран файл: ${fileRef.fullPath}`);
        } catch (fileError) {
          console.error(`❌ Грешка при копиране на файл ${fileRef.fullPath}:`, fileError);
        }
      }
      
    } catch (error) {
      console.error(`❌ Грешка при копиране на папка ${folder}:`, error);
    }
  }
}

async function migrateAll() {
  try {
    await migrateFirestoreData();
    await migrateStorageFiles();
    console.log('🎉 Миграцията завърши успешно!');
  } catch (error) {
    console.error('❌ Грешка при миграция:', error);
  }
}

// Стартиране на миграцията
migrateAll();