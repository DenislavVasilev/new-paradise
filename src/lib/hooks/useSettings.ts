import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface SiteSettings {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  socialMedia: {
    facebook: string;
    instagram: string;
  };
  updatedAt?: Date;
}

const defaultSettings: SiteSettings = {
  id: 'site-settings',
  companyName: 'Paradise Green Park',
  email: 'office@paradise-greenpark.bg',
  phone: '0889 66 00 00',
  address: 'Златни пясъци, 9007 Варна, България',
  socialMedia: {
    facebook: 'https://facebook.com/paradise-greenpark',
    instagram: 'https://instagram.com/paradise-greenpark'
  }
};

export const useSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'content', 'site-settings');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings({
          id: docSnap.id,
          ...data,
          updatedAt: data.updatedAt?.toDate()
        } as SiteSettings);
      } else {
        // Create default settings if they don't exist
        await saveSettings(defaultSettings);
        setSettings(defaultSettings);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Грешка при зареждане на настройките');
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      const docRef = doc(db, 'content', 'site-settings');
      const settingsData = {
        ...newSettings,
        updatedAt: serverTimestamp()
      };
      
      await setDoc(docRef, settingsData);
      setSettings({ ...settings, ...newSettings, updatedAt: new Date() });
      return true;
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Грешка при запазване на настройките');
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