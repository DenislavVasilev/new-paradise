import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export interface ParkingSpot {
  id: string;
  number: string;
  floor: number;
  type: 'covered' | 'uncovered';
  size: string;
  price: number;
  status: 'available' | 'reserved' | 'sold';
  internalNotes?: string;
}

export const useParkingSpots = (floor?: string, type?: string, status?: string) => {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchParkingSpots();
  }, [floor, type, status]);

  const fetchParkingSpots = async () => {
    try {
      setLoading(true);
      let q = query(collection(db, 'parkingSpots'));

      if (floor) {
        const floorNumber = floor === 'basement' ? -1 : parseInt(floor.replace('floor', ''));
        q = query(q, where('floor', '==', floorNumber));
      }
      if (type) {
        q = query(q, where('type', '==', type));
      }
      if (status && status !== 'всички') {
        q = query(q, where('status', '==', status));
      }

      const querySnapshot = await getDocs(q);
      const parkingData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ParkingSpot[];

      // Sort parking spots first by floor, then by number
      const sortedParkingSpots = parkingData.sort((a, b) => {
        if (a.floor !== b.floor) {
          return a.floor - b.floor;
        }
        // Extract numeric parts from parking spot numbers for proper numeric sorting
        const aNum = parseInt(a.number.replace(/\D/g, ''));
        const bNum = parseInt(b.number.replace(/\D/g, ''));
        return aNum - bNum;
      });

      setParkingSpots(sortedParkingSpots);
      setError(null);
    } catch (err) {
      console.error('Error fetching parking spots:', err);
      setError('Грешка при зареждане на паркоместата');
    } finally {
      setLoading(false);
    }
  };

  const addParkingSpot = async (parkingSpot: Omit<ParkingSpot, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'parkingSpots'), parkingSpot);
      const newParkingSpot = { id: docRef.id, ...parkingSpot };
      setParkingSpots([...parkingSpots, newParkingSpot]);
      return newParkingSpot;
    } catch (err) {
      console.error('Error adding parking spot:', err);
      throw new Error('Грешка при добавяне на паркомясто');
    }
  };

  const updateParkingSpot = async (id: string, data: Partial<ParkingSpot>) => {
    try {
      const parkingRef = doc(db, 'parkingSpots', id);
      await updateDoc(parkingRef, data);
      setParkingSpots(spots => 
        spots.map(spot => spot.id === id ? { ...spot, ...data } : spot)
      );
    } catch (err) {
      console.error('Error updating parking spot:', err);
      throw new Error('Грешка при обновяване на паркомясто');
    }
  };

  const deleteParkingSpot = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'parkingSpots', id));
      setParkingSpots(spots => spots.filter(spot => spot.id !== id));
    } catch (err) {
      console.error('Error deleting parking spot:', err);
      throw new Error('Грешка при изтриване на паркомясто');
    }
  };

  return {
    parkingSpots,
    loading,
    error,
    addParkingSpot,
    updateParkingSpot,
    deleteParkingSpot,
    refreshParkingSpots: fetchParkingSpots
  };
};