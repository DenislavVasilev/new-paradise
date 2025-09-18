import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface Entrance {
  id: string;
  name: string;
  label: string;
  floors: number[];
}

export interface BuildingConfig {
  id: string;
  entrances: Entrance[];
  createdAt?: Date;
  updatedAt?: Date;
}

const defaultConfig: BuildingConfig = {
  id: 'default',
  entrances: [
    {
      id: '1',
      name: 'Вход А',
      label: 'А',
      floors: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    },
    {
      id: '2',
      name: 'Вход Б',
      label: 'Б',
      floors: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    }
  ]
};

export const useBuildingConfig = () => {
  const [config, setConfig] = useState<BuildingConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'buildingConfig', 'default');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setConfig({
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as BuildingConfig);
      } else {
        // Create default config if it doesn't exist
        await saveConfig(defaultConfig);
        setConfig(defaultConfig);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching building config:', err);
      setError('Грешка при зареждане на конфигурацията');
      setConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (newConfig: BuildingConfig) => {
    try {
      const docRef = doc(db, 'buildingConfig', 'default');
      const configData = {
        ...newConfig,
        updatedAt: new Date()
      };
      
      await setDoc(docRef, configData);
      setConfig(configData);
      return true;
    } catch (err) {
      console.error('Error saving building config:', err);
      setError('Грешка при запазване на конфигурацията');
      return false;
    }
  };

  const addEntrance = (entrance: Omit<Entrance, 'id'>) => {
    const newEntrance: Entrance = {
      ...entrance,
      id: Date.now().toString()
    };
    
    const newConfig = {
      ...config,
      entrances: [...config.entrances, newEntrance]
    };
    
    return saveConfig(newConfig);
  };

  const updateEntrance = (entranceId: string, updates: Partial<Entrance>) => {
    const newConfig = {
      ...config,
      entrances: config.entrances.map(entrance =>
        entrance.id === entranceId ? { ...entrance, ...updates } : entrance
      )
    };
    
    return saveConfig(newConfig);
  };

  const removeEntrance = (entranceId: string) => {
    const newConfig = {
      ...config,
      entrances: config.entrances.filter(entrance => entrance.id !== entranceId)
    };
    
    return saveConfig(newConfig);
  };

  const getAvailableFloors = (entranceId?: string) => {
    if (!entranceId) {
      // Return all unique floors from all entrances
      const allFloors = config.entrances.flatMap(entrance => entrance.floors);
      return [...new Set(allFloors)].sort((a, b) => a - b);
    }
    
    const entrance = config.entrances.find(e => e.id === entranceId);
    return entrance ? entrance.floors.sort((a, b) => a - b) : [];
  };

  const getEntranceLabel = (entranceId: string) => {
    const entrance = config.entrances.find(e => e.id === entranceId);
    return entrance ? entrance.label : entranceId;
  };

  const getEntranceName = (entranceId: string) => {
    const entrance = config.entrances.find(e => e.id === entranceId);
    return entrance ? entrance.name : `Вход ${entranceId}`;
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    loading,
    error,
    addEntrance,
    updateEntrance,
    removeEntrance,
    getAvailableFloors,
    getEntranceLabel,
    getEntranceName,
    refreshConfig: fetchConfig
  };
};