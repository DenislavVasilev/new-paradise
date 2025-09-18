import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, auth } from '../../config/firebase';

export interface FloorPlan {
  id: string;
  entrance: string;
  floor: number;
  imageUrl: string;
  apartments: ApartmentMarker[];
}

export interface ApartmentMarker {
  id: string;
  number: string;
  position: { x: number; y: number };
}

export const useFloorPlans = (entrance?: string, floor?: number) => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFloorPlans();
  }, [entrance, floor]);

  const fetchFloorPlans = async () => {
    try {
      setLoading(true);
      let q = query(collection(db, 'floorPlans'));

      if (entrance) {
        q = query(q, where('entrance', '==', entrance));
      }
      if (floor) {
        q = query(q, where('floor', '==', floor));
      }

      const querySnapshot = await getDocs(q);
      const floorPlanData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FloorPlan[];

      setFloorPlans(floorPlanData);
      setError(null);
    } catch (err) {
      console.error('Error fetching floor plans:', err);
      setError('Грешка при зареждане на етажните планове');
    } finally {
      setLoading(false);
    }
  };

  const uploadFloorPlan = async (file: File, entrance: string, floor: number) => {
    if (!auth.currentUser) {
      throw new Error('Трябва да сте влезли в системата, за да качвате етажни планове');
    }

    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Моля, качете само изображения');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Файлът трябва да е по-малък от 5MB');
      }

      const timestamp = Date.now();
      const safeFileName = encodeURIComponent(file.name).replace(/%/g, '_');
      const fileName = `${entrance}_${floor}_${timestamp}_${safeFileName}`;
      const storageRef = ref(storage, `floorPlans/${fileName}`);

      await uploadBytes(storageRef, file, {
        customMetadata: {
          uploadedBy: auth.currentUser.uid,
          entrance: entrance,
          floor: floor.toString(),
          uploadedAt: new Date().toISOString()
        }
      });

      const imageUrl = await getDownloadURL(storageRef);

      const floorPlan = {
        entrance,
        floor,
        imageUrl,
        apartments: []
      };

      const docRef = await addDoc(collection(db, 'floorPlans'), floorPlan);
      const newFloorPlan = { id: docRef.id, ...floorPlan };
      setFloorPlans([...floorPlans, newFloorPlan]);
      return newFloorPlan;
    } catch (err) {
      console.error('Error uploading floor plan:', err);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error('Грешка при качване на етажен план');
    }
  };

  const updateFloorPlan = async (id: string, data: Partial<FloorPlan>) => {
    if (!auth.currentUser) {
      throw new Error('Трябва да сте влезли в системата, за да редактирате етажни планове');
    }

    try {
      const floorPlanRef = doc(db, 'floorPlans', id);
      await updateDoc(floorPlanRef, data);
      setFloorPlans(plans => 
        plans.map(plan => plan.id === id ? { ...plan, ...data } : plan)
      );
    } catch (err) {
      console.error('Error updating floor plan:', err);
      throw new Error('Грешка при обновяване на етажен план');
    }
  };

  const deleteFloorPlan = async (id: string, imageUrl: string) => {
    if (!auth.currentUser) {
      throw new Error('Трябва да сте влезли в системата, за да изтривате етажни планове');
    }

    try {
      // Extract the path from the Firebase Storage URL
      const urlPath = decodeURIComponent(imageUrl);
      const pathMatch = urlPath.match(/o\/(.*?)\?/);
      if (!pathMatch) {
        throw new Error('Невалиден URL на изображението');
      }
      const storagePath = decodeURIComponent(pathMatch[1]);
      const storageRef = ref(storage, storagePath);

      // Delete image from storage
      await deleteObject(storageRef);

      // Delete document from Firestore
      await deleteDoc(doc(db, 'floorPlans', id));
      setFloorPlans(plans => plans.filter(plan => plan.id !== id));
    } catch (err) {
      console.error('Error deleting floor plan:', err);
      if (err instanceof Error) {
        throw new Error(`Грешка при изтриване на етажен план: ${err.message}`);
      }
      throw new Error('Грешка при изтриване на етажен план');
    }
  };

  return {
    floorPlans,
    loading,
    error,
    uploadFloorPlan,
    updateFloorPlan,
    deleteFloorPlan,
    refreshFloorPlans: fetchFloorPlans
  };
};