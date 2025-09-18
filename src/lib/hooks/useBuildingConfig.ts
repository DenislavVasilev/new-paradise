import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface Entrance {
  id: string;
  name: string;
  label: string;
  floors: number[];
}

export interface ApartmentType {
  id: string;
  name: string;
  label: string;
  rooms: number;
}

export interface BuildingConfig {
  id: string;
  entrances: Entrance[];
  apartmentTypes: ApartmentType[];
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
  ],
  apartmentTypes: [
    { id: 'studio', name: 'Студио', label: 'Студио', rooms: 1 },
    { id: '1-bedroom', name: 'Едностаен', label: '1-стаен', rooms: 1 },
    { id: '2-bedroom', name: 'Двустаен', label: '2-стаен', rooms: 2 },
    { id: '2-bedroom-maisonette', name: 'Двустаен мезонет', label: '2-стаен мезонет', rooms: 2 },
    { id: '3-bedroom', name: 'Тристаен', label: '3-стаен', rooms: 3 },
    { id: '3-bedroom-maisonette', name: 'Тристаен мезонет', label: '3-стаен мезонет', rooms: 3 },
    { id: '4-bedroom-maisonette', name: 'Четиристаен мезонет', label: '4-стаен мезонет', rooms: 4 }
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
          apartmentTypes: data.apartmentTypes || defaultConfig.apartmentTypes,
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

  const addApartmentType = (apartmentType: Omit<ApartmentType, 'id'>) => {
    const newApartmentType: ApartmentType = {
      ...apartmentType,
      id: Date.now().toString()
    };
    
    const newConfig = {
      ...config,
      apartmentTypes: [...config.apartmentTypes, newApartmentType]
    };
    
    return saveConfig(newConfig);
  };

  const updateApartmentType = (typeId: string, updates: Partial<ApartmentType>) => {
    const newConfig = {
      ...config,
      apartmentTypes: config.apartmentTypes.map(type =>
        type.id === typeId ? { ...type, ...updates } : type
      )
    };
    
    return saveConfig(newConfig);
  };

  const removeApartmentType = (typeId: string) => {
    const newConfig = {
      ...config,
      apartmentTypes: config.apartmentTypes.filter(type => type.id !== typeId)
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

  const getApartmentTypeLabel = (typeId: string) => {
    const type = config.apartmentTypes.find(t => t.id === typeId);
    return type ? type.label : typeId;
  };

  const getApartmentTypeName = (typeId: string) => {
    const type = config.apartmentTypes.find(t => t.id === typeId);
    return type ? type.name : typeId;
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
    addApartmentType,
    updateApartmentType,
    removeApartmentType,
    getAvailableFloors,
    getEntranceLabel,
    getEntranceName,
    getApartmentTypeLabel,
    getApartmentTypeName,
    refreshConfig: fetchConfig
  };
};