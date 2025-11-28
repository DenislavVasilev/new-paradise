import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';

export interface Apartment {
  id: string;
  entrance: string;
  number: string;
  floor: number;
  secondaryFloor?: number | null;
  type: string;
  rooms: number;
  area: number;
  netArea?: number; // Чиста площ
  price: number;
  promoPrice?: number; // Промоционална цена
  status: 'available' | 'reserved' | 'sold';
  description: string;
  features: string[];
  images: string[];
  mainImage?: string;
  hasTerrace: boolean;
  exposure: string;
  internalNotes?: string;
  brochureUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useApartments = (
  entrance?: string,
  floor?: string,
  type?: string,
  status?: string
) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const fetchApartments = async () => {
    try {
      setLoading(true);

      const floorNumber = floor && floor !== 'всички' ? parseInt(floor) : null;

      if (floorNumber !== null) {
        let primaryQ = query(collection(db, 'apartments'), where('floor', '==', floorNumber));
        let secondaryQ = query(collection(db, 'apartments'), where('secondaryFloor', '==', floorNumber));

        if (entrance && entrance !== 'всички') {
          primaryQ = query(primaryQ, where('entrance', '==', entrance));
          secondaryQ = query(secondaryQ, where('entrance', '==', entrance));
        }

        if (type && type !== 'всички') {
          primaryQ = query(primaryQ, where('type', '==', type));
          secondaryQ = query(secondaryQ, where('type', '==', type));
        }

        if (status && status !== 'всички') {
          primaryQ = query(primaryQ, where('status', '==', status));
          secondaryQ = query(secondaryQ, where('status', '==', status));
        }

        const [primarySnapshot, secondarySnapshot] = await Promise.all([
          getDocs(primaryQ),
          getDocs(secondaryQ)
        ]);

        const primaryApartments = primarySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        }));

        const secondaryApartments = secondarySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        }));

        const combinedApartments = [...primaryApartments, ...secondaryApartments];
        const uniqueApartments = Array.from(
          new Map(combinedApartments.map(item => [item.id, item])).values()
        );

        const sortedApartments = uniqueApartments.sort((a, b) => {
          if (a.entrance !== b.entrance) {
            return a.entrance.localeCompare(b.entrance);
          }
          return parseInt(a.number) - parseInt(b.number);
        });

        setApartments(sortedApartments as Apartment[]);
        setError(null);
      } else {
        let q = query(collection(db, 'apartments'));

        if (entrance && entrance !== 'всички') {
          q = query(q, where('entrance', '==', entrance));
        }

        if (type && type !== 'всички') {
          q = query(q, where('type', '==', type));
        }

        if (status && status !== 'всички') {
          q = query(q, where('status', '==', status));
        }

        const querySnapshot = await getDocs(q);
        const apartmentData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        })) as Apartment[];

        const sortedApartments = apartmentData.sort((a, b) => {
          if (a.entrance !== b.entrance) {
            return a.entrance.localeCompare(b.entrance);
          }
          return parseInt(a.number) - parseInt(b.number);
        });

        setApartments(sortedApartments);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching apartments:', err);
      setError('Грешка при зареждане на апартаментите');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, apartmentId: string, type: 'image' | 'brochure'): Promise<string> => {
    const timestamp = Date.now();
    const safeFileName = encodeURIComponent(file.name).replace(/%/g, '_');
    const path = `apartments/${apartmentId}/${type}_${timestamp}_${safeFileName}`;
    const storageRef = ref(storage, path);

    try {
      const uploadTask = uploadBytes(storageRef, file, {
        contentType: file.type,
        customMetadata: {
          apartmentId,
          uploadedAt: new Date().toISOString(),
          fileType: type
        }
      });

      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

      const snapshot = await uploadTask;
      setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));

      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error(`Failed to upload ${type}`);
    }
  };

  const addApartment = async (apartment: Omit<Apartment, 'id'>) => {
    try {
      const apartmentData = {
        ...apartment,
        images: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'apartments'), apartmentData);
      const newApartment = { 
        id: docRef.id, 
        ...apartment,
        images: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setApartments(prev => [...prev, newApartment]);
      return newApartment;
    } catch (err) {
      console.error('Error adding apartment:', err);
      throw new Error('Грешка при добавяне на апартамент');
    }
  };

  const updateApartment = async (id: string, data: Partial<Apartment>) => {
    try {
      const apartmentRef = doc(db, 'apartments', id);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(apartmentRef, updateData);
      setApartments(apartments.map(apt => 
        apt.id === id ? { ...apt, ...data, updatedAt: new Date() } : apt
      ));
    } catch (err) {
      console.error('Error updating apartment:', err);
      throw new Error('Грешка при обновяване на апартамент');
    }
  };

  const deleteApartment = async (id: string) => {
    try {
      const apartment = apartments.find(apt => apt.id === id);
      if (apartment) {
        if (apartment.images?.length) {
          for (const imageUrl of apartment.images) {
            try {
              const imageRef = ref(storage, imageUrl);
              await deleteObject(imageRef);
            } catch (error) {
              console.error('Error deleting image:', error);
            }
          }
        }
        
        if (apartment.brochureUrl) {
          try {
            const brochureRef = ref(storage, apartment.brochureUrl);
            await deleteObject(brochureRef);
          } catch (error) {
            console.error('Error deleting brochure:', error);
          }
        }
      }

      await deleteDoc(doc(db, 'apartments', id));
      setApartments(apartments.filter(apt => apt.id !== id));
    } catch (err) {
      console.error('Error deleting apartment:', err);
      throw new Error('Грешка при изтриване на апартамент');
    }
  };

  const addImages = async (apartmentId: string, files: File[]) => {
    try {
      const apartment = apartments.find(apt => apt.id === apartmentId);
      if (!apartment) throw new Error('Apartment not found');

      const uploadPromises = files.map(file => uploadFile(file, apartmentId, 'image'));
      const imageUrls = await Promise.all(uploadPromises);

      const updatedImages = [...(apartment.images || []), ...imageUrls];
      await updateApartment(apartmentId, { 
        images: updatedImages,
        mainImage: apartment.mainImage || imageUrls[0]
      });

      return imageUrls;
    } catch (error) {
      console.error('Error adding images:', error);
      throw new Error('Failed to add images');
    }
  };

  const uploadBrochure = async (apartmentId: string, file: File) => {
    try {
      const url = await uploadFile(file, apartmentId, 'brochure');
      await updateApartment(apartmentId, { brochureUrl: url });
      return url;
    } catch (error) {
      console.error('Error uploading brochure:', error);
      throw new Error('Failed to upload brochure');
    }
  };

  const deleteBrochure = async (apartmentId: string, brochureUrl: string) => {
    try {
      const brochureRef = ref(storage, brochureUrl);
      await deleteObject(brochureRef);
      await updateApartment(apartmentId, { brochureUrl: null });
    } catch (error) {
      console.error('Error deleting brochure:', error);
      throw new Error('Failed to delete brochure');
    }
  };

  const deleteImage = async (apartmentId: string, imageUrl: string) => {
    try {
      const apartment = apartments.find(apt => apt.id === apartmentId);
      if (!apartment) throw new Error('Apartment not found');

      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);

      const updatedImages = apartment.images.filter(url => url !== imageUrl);
      const updates: Partial<Apartment> = { images: updatedImages };
      
      if (apartment.mainImage === imageUrl) {
        updates.mainImage = updatedImages[0] || null;
      }

      await updateApartment(apartmentId, updates);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  };

  const setMainImage = async (apartmentId: string, imageUrl: string) => {
    try {
      await updateApartment(apartmentId, { mainImage: imageUrl });
    } catch (error) {
      console.error('Error setting main image:', error);
      throw new Error('Failed to set main image');
    }
  };

  useEffect(() => {
    fetchApartments();
  }, [entrance, floor, type, status]);

  return {
    apartments,
    loading,
    error,
    uploadProgress,
    addApartment,
    updateApartment,
    deleteApartment,
    addImages,
    deleteImage,
    setMainImage,
    uploadBrochure,
    deleteBrochure,
    refreshApartments: fetchApartments
  };
};