import React, { useState, useEffect } from 'react';
import { ChevronDown, Loader2, X } from 'lucide-react';
import { useParkingSpots } from '../lib/hooks/useParkingSpots';
import { Link } from 'react-router-dom';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '../lib/firebase';

const ParkingPage = () => {
  const [selectedFloor, setSelectedFloor] = useState<string>('basement');
  const { parkingSpots, loading, error } = useParkingSpots(selectedFloor);
  const [floorImage, setFloorImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    const fetchFloorImage = async () => {
      try {
        setLoadingImage(true);
        const floor = selectedFloor === 'basement' ? -1 : 
                     selectedFloor === 'floor1' ? 1 : 2;
                     
        // List all files in the parking folder
        const storageRef = ref(storage, 'parking');
        const files = await listAll(storageRef);
        
        // Find the most recent image for this floor
        const floorFiles = files.items.filter(item => 
          item.name.startsWith(`floor_${floor}_`)
        );
        
        if (floorFiles.length > 0) {
          // Get the most recent file (last in array after sorting)
          const latestFile = floorFiles.sort((a, b) => 
            b.name.localeCompare(a.name)
          )[0];
          
          const url = await getDownloadURL(latestFile);
          setFloorImage(url);
        } else {
          // Fallback to static images
          setFloorImage(getStaticFloorImage(selectedFloor));
        }
      } catch (error) {
        console.error('Error fetching floor image:', error);
        // Fallback to static images
        setFloorImage(getStaticFloorImage(selectedFloor));
      } finally {
        setLoadingImage(false);
      }
    };

    fetchFloorImage();
  }, [selectedFloor]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showLightbox) {
        setShowLightbox(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox]);

  const getStaticFloorImage = (floor: string) => {
    switch (floor) {
      case 'basement':
        return '/images/43dff43b-12e1-4c00-bdd8-afdba2c3867a.png';
      case 'floor1':
        return '/images/43dff43b-12e1-4c00-bdd8-afdba2c3867a copy.png';
      case 'floor2':
        return '/images/43dff43b-12e1-4c00-bdd8-afdba2c3867a.png';
      default:
        return '/images/43dff43b-12e1-4c00-bdd8-afdba2c3867a.png';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'reserved':
        return 'bg-orange-100 text-orange-800';
      case 'sold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Свободно';
      case 'reserved':
        return 'Резервирано';
      case 'sold':
        return 'Продадено';
      default:
        return '';
    }
  };

  const getFloorNumber = (floor: string) => {
    switch (floor) {
      case 'basement':
        return -1;
      case 'floor1':
        return 1;
      case 'floor2':
        return 2;
      default:
        return -1;
    }
  };

  // Sort parking spots by number
  const sortedParkingSpots = [...parkingSpots]
    .filter(spot => spot.floor === getFloorNumber(selectedFloor))
    .sort((a, b) => {
      // Extract numeric part from parking spot numbers
      const aNum = parseInt(a.number.replace(/\D/g, ''));
      const bNum = parseInt(b.number.replace(/\D/g, ''));
      return aNum - bNum;
    });

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="section-title">Паркоместа</h1>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Открити и закрити паркоместа с денонощна охрана и видеонаблюдение
            </p>
          </div>

          <div className="mb-8">
            <div className="max-w-xs mx-auto">
              <div className="relative">
                <select
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8"
                >
                  <option value="basement">Подземен етаж</option>
                  <option value="floor1">Етаж 1</option>
                  <option value="floor2">Етаж 2</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            {loadingImage ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <img
                src={floorImage || getStaticFloorImage(selectedFloor)}
                alt={`План на паркинг етаж ${selectedFloor}`}
                className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setShowLightbox(true)}
              />
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="p-3 text-left">Номер</th>
                  <th className="p-3 text-left">Етаж</th>
                  <th className="p-3 text-left">Тип</th>
                  <th className="p-3 text-left">Размери</th>
                  <th className="p-3 text-left">Цена</th>
                  <th className="p-3 text-left">Статус</th>
                </tr>
              </thead>
              <tbody>
                {sortedParkingSpots.map((spot, index) => (
                  <tr 
                    key={spot.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="p-3 border-b border-gray-200">
                      <Link
                        to={`/parking/${spot.id}`}
                        className="text-primary hover:text-primary-dark transition-colors"
                      >
                        {spot.number}
                      </Link>
                    </td>
                    <td className="p-3 border-b border-gray-200">{spot.floor}</td>
                    <td className="p-3 border-b border-gray-200">
                      {spot.type === 'covered' ? 'Закрито' : 'Открито'}
                    </td>
                    <td className="p-3 border-b border-gray-200">{spot.size}</td>
                    <td className="p-3 border-b border-gray-200">
                      {spot.price > 0 ? `€${spot.price.toLocaleString()}` : ''}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(spot.status)}`}>
                        {getStatusText(spot.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center gap-6 mt-8">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-100 mr-2"></div>
              <span>Свободно</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-orange-100 mr-2"></div>
              <span>Резервирано</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-100 mr-2"></div>
              <span>Продадено</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && floorImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setShowLightbox(false)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <img
            src={floorImage}
            alt={`План на паркинг етаж ${selectedFloor}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default ParkingPage;