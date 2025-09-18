import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface LocationSettings {
  id: string;
  googleMapsUrl: string;
  title: string;
  description: string;
  updatedAt?: Date;
}

const defaultSettings: LocationSettings = {
  id: 'location',
  googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2909.123456789!2d28.123456!3d43.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDA3JzI0LjQiTiAyOMKwMDcnMjQuNCJF!5e0!3m2!1sen!2sbg!4v1234567890123!5m2!1sen!2sbg',
  title: 'Локация',
  description: 'Стратегическо местоположение с отлична достъпност до ключови точки в града'
};

export const useLocationSettings = () => {
  const [settings, setSettings] = useState<LocationSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'content', 'location');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings({
          id: docSnap.id,
          ...data,
          updatedAt: data.updatedAt?.toDate()
        } as LocationSettings);
      } else {
        // Create default settings if they don't exist
        await saveSettings(defaultSettings);
        setSettings(defaultSettings);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching location settings:', err);
      setError('Грешка при зареждане на настройките за локация');
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: Partial<LocationSettings>) => {
    try {
      const docRef = doc(db, 'content', 'location');
      const settingsData = {
        ...newSettings,
        updatedAt: serverTimestamp()
      };
      
      await setDoc(docRef, settingsData);
      setSettings({ ...settings, ...newSettings, updatedAt: new Date() });
      return true;
    } catch (err) {
      console.error('Error saving location settings:', err);
      setError('Грешка при запазване на настройките за локация');
      return false;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    saveSettings,
    refreshSettings: fetchSettings
  };
};