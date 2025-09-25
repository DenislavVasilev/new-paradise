import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface StatItem {
  id: string;
  icon: string;
  number: number;
  label: string;
  description: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  order: number;
}

export interface FeatureItem {
  id: string;
  icon: string;
  text: string;
  gradient: string;
  order: number;
}

export interface AvailabilitySettings {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  stats: StatItem[];
  features: FeatureItem[];
  updatedAt?: Date;
}

const defaultSettings: AvailabilitySettings = {
  id: 'availability',
  title: 'Paradise Green Park',
  subtitle: 'в цифри',
  description: 'Открийте луксоза и комфорта в най-престижния морски комплекс',
  stats: [
    {
      id: '1',
      icon: 'Building2',
      number: 85,
      label: 'Луксозни апартамента',
      description: 'С панорамна гледка',
      gradient: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      order: 1
    },
    {
      id: '2',
      icon: 'Car',
      number: 95,
      label: 'Охраняеми паркоместа',
      description: 'Подземен гараж',
      gradient: 'from-blue-500 to-cyan-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      order: 2
    },
    {
      id: '3',
      icon: 'Waves',
      number: 250,
      label: 'кв.м басейнов комплекс',
      description: 'С морска вода',
      gradient: 'from-cyan-500 to-blue-600',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      order: 3
    },
    {
      id: '4',
      icon: 'MapPin',
      number: 50,
      label: 'метра до плажа',
      description: 'Златни пясъци',
      gradient: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      order: 4
    }
  ],
  features: [
    {
      id: '1',
      icon: 'Users',
      text: '24/7 Консиерж услуги',
      gradient: 'from-purple-500 to-pink-600',
      order: 1
    },
    {
      id: '2',
      icon: 'Star',
      text: '5-звезден СПА център',
      gradient: 'from-yellow-500 to-orange-600',
      order: 2
    },
    {
      id: '3',
      icon: 'Sparkles',
      text: 'Премиум довършвания',
      gradient: 'from-indigo-500 to-purple-600',
      order: 3
    },
    {
      id: '4',
      icon: 'Sun',
      text: 'Целогодишен сезон',
      gradient: 'from-orange-500 to-red-600',
      order: 4
    }
  ]
};

export const useAvailabilitySettings = () => {
  const [settings, setSettings] = useState<AvailabilitySettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'content', 'availability');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings({
          id: docSnap.id,
          ...data,
          stats: Array.isArray(data.stats) ? data.stats : defaultSettings.stats,
          features: Array.isArray(data.features) ? data.features : defaultSettings.features,
          updatedAt: data.updatedAt?.toDate()
        } as AvailabilitySettings);
      } else {
        // Create default settings if they don't exist
        await saveSettings(defaultSettings);
        setSettings(defaultSettings);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching availability settings:', err);
      setError('Грешка при зареждане на настройките');
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: Partial<AvailabilitySettings>) => {
    try {
      const docRef = doc(db, 'content', 'availability');
      const settingsData = {
        ...newSettings,
        updatedAt: serverTimestamp()
      };
      
      await setDoc(docRef, settingsData);
      setSettings({ ...settings, ...newSettings, updatedAt: new Date() });
      return true;
    } catch (err) {
      console.error('Error saving availability settings:', err);
      setError('Грешка при запазване на настройките');
      return false;
    }
  };

  const updateStat = async (statId: string, statData: Partial<StatItem>) => {
    const updatedStats = settings.stats.map(stat =>
      stat.id === statId ? { ...stat, ...statData } : stat
    );
    const updatedSettings = {
      ...settings,
      stats: updatedStats
    };
    return await saveSettings(updatedSettings);
  };

  const addStat = async (statData: Omit<StatItem, 'id' | 'order'>) => {
    const newStat: StatItem = {
      ...statData,
      id: Date.now().toString(),
      order: settings.stats.length + 1
    };
    const updatedSettings = {
      ...settings,
      stats: [...settings.stats, newStat]
    };
    return await saveSettings(updatedSettings);
  };

  const removeStat = async (statId: string) => {
    const updatedStats = settings.stats
      .filter(stat => stat.id !== statId)
      .map((stat, index) => ({ ...stat, order: index + 1 }));
    
    const updatedSettings = {
      ...settings,
      stats: updatedStats
    };
    return await saveSettings(updatedSettings);
  };

  const reorderStats = async (stats: StatItem[]) => {
    const updatedSettings = {
      ...settings,
      stats: stats.map((stat, index) => ({ ...stat, order: index + 1 }))
    };
    return await saveSettings(updatedSettings);
  };

  const updateFeature = async (featureId: string, featureData: Partial<FeatureItem>) => {
    const updatedFeatures = settings.features.map(feature =>
      feature.id === featureId ? { ...feature, ...featureData } : feature
    );
    const updatedSettings = {
      ...settings,
      features: updatedFeatures
    };
    return await saveSettings(updatedSettings);
  };

  const addFeature = async (featureData: Omit<FeatureItem, 'id' | 'order'>) => {
    const newFeature: FeatureItem = {
      ...featureData,
      id: Date.now().toString(),
      order: settings.features.length + 1
    };
    const updatedSettings = {
      ...settings,
      features: [...settings.features, newFeature]
    };
    return await saveSettings(updatedSettings);
  };

  const removeFeature = async (featureId: string) => {
    const updatedFeatures = settings.features
      .filter(feature => feature.id !== featureId)
      .map((feature, index) => ({ ...feature, order: index + 1 }));
    
    const updatedSettings = {
      ...settings,
      features: updatedFeatures
    };
    return await saveSettings(updatedSettings);
  };

  const reorderFeatures = async (features: FeatureItem[]) => {
    const updatedSettings = {
      ...settings,
      features: features.map((feature, index) => ({ ...feature, order: index + 1 }))
    };
    return await saveSettings(updatedSettings);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    saveSettings,
    updateStat,
    addStat,
    removeStat,
    reorderStats,
    updateFeature,
    addFeature,
    removeFeature,
    reorderFeatures,
    refreshSettings: fetchSettings
  };
};