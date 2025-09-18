import { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';

export interface Store {
  id: string;
  title: string;
  description: string;
  mainImage: string;
  secondaryImage?: string;
}

export const useStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'stores'));
      const querySnapshot = await getDocs(q);
      const storeData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Store[];
      setStores(storeData);
      setError(null);
    } catch (err) {
      console.error('Error fetching stores:', err);
      setError('Грешка при зареждане на обектите');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (storeId: string, file: File, type: 'main' | 'secondary') => {
    const timestamp = Date.now();
    const safeFileName = encodeURIComponent(file.name).replace(/%/g, '_');
    const path = `stores/${storeId}/${type}_${timestamp}_${safeFileName}`;
    const storageRef = ref(storage, path);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      
      const storeRef = doc(db, 'stores', storeId);
      await updateDoc(storeRef, {
        [`${type}Image`]: downloadUrl
      });

      setStores(stores.map(store =>
        store.id === storeId
          ? { ...store, [`${type}Image`]: downloadUrl }
          : store
      ));

      return downloadUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw new Error(error.message || 'Failed to upload image');
    }
  };

  const addStore = async (data: Omit<Store, 'id' | 'mainImage' | 'secondaryImage'>) => {
    try {
      const docRef = await addDoc(collection(db, 'stores'), {
        ...data,
        mainImage: '',
        secondaryImage: ''
      });
      const newStore = { id: docRef.id, ...data, mainImage: '', secondaryImage: '' };
      setStores([...stores, newStore]);
      return newStore;
    } catch (err) {
      console.error('Error adding store:', err);
      throw new Error('Грешка при добавяне на обект');
    }
  };

  const updateStore = async (id: string, data: Partial<Store>) => {
    try {
      const storeRef = doc(db, 'stores', id);
      await updateDoc(storeRef, data);
      setStores(stores.map(store =>
        store.id === id ? { ...store, ...data } : store
      ));
    } catch (err) {
      console.error('Error updating store:', err);
      throw new Error('Грешка при обновяване на обект');
    }
  };

  const deleteStore = async (id: string) => {
    try {
      const store = stores.find(s => s.id === id);
      if (store) {
        // Delete images from storage
        if (store.mainImage) {
          const mainImageRef = ref(storage, store.mainImage);
          await deleteObject(mainImageRef);
        }
        if (store.secondaryImage) {
          const secondaryImageRef = ref(storage, store.secondaryImage);
          await deleteObject(secondaryImageRef);
        }
      }

      await deleteDoc(doc(db, 'stores', id));
      setStores(stores.filter(store => store.id !== id));
    } catch (err) {
      console.error('Error deleting store:', err);
      throw new Error('Грешка при изтриване на обект');
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return {
    stores,
    loading,
    error,
    addStore,
    updateStore,
    deleteStore,
    uploadImage,
    refreshStores: fetchStores
  };
};