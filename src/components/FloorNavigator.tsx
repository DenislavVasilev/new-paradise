import React, { useState, useEffect } from 'react';
import { Building2, Home, Check, X, Clock, ChevronDown } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

interface Apartment {
  id: string;
  number: string;
  entrance: string;
  floor: number;
  rooms: number;
  area: number;
  price: number;
  status: 'available' | 'reserved' | 'sold';
  position: {
    top: string;
    left: string;
  };
}

const FloorNavigator = () => {
  const navigate = useNavigate();
  const { entrance: urlEntrance, floor: urlFloor } = useParams();
  
  const [selectedEntrance, setSelectedEntrance] = useState(urlEntrance || '2');
  const [selectedFloor, setSelectedFloor] = useState(Number(urlFloor) || 1);
  const [hoveredApartment, setHoveredApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(false);

  const totalFloors = 11;
  const floors = Array.from({ length: totalFloors }, (_, i) => totalFloors - i);
  const entrances = ['1', '2'];

  useEffect(() => {
    // Update URL when filters change
    navigate(`/navigator/${selectedEntrance}/${selectedFloor}`, { replace: true });
  }, [selectedEntrance, selectedFloor, navigate]);

  // Update state when URL params change
  useEffect(() => {
    if (urlEntrance && entrances.includes(urlEntrance)) {
      setSelectedEntrance(urlEntrance);
    }
    if (urlFloor && !isNaN(Number(urlFloor)) && Number(urlFloor) >= 1 && Number(urlFloor) <= totalFloors) {
      setSelectedFloor(Number(urlFloor));
    }
  }, [urlEntrance, urlFloor]);

  const mockApartments: Apartment[] = [
    {
      id: 'A1',
      number: '1',
      entrance: '2',
      floor: 1,
      rooms: 2,
      area: 78.50,
      price: 168775,
      status: 'available',
      position: {
        top: '75%',
        left: '85%'
      }
    },
    {
      id: 'A2',
      number: '2',
      entrance: '2',
      floor: 1,
      rooms: 2,
      area: 64.69,
      price: 139083,
      status: 'available',
      position: {
        top: '65%',
        left: '85%'
      }
    },
    {
      id: 'A3',
      number: '3',
      entrance: '2',
      floor: 1,
      rooms: 2,
      area: 70.85,
      price: 152327,
      status: 'reserved',
      position: {
        top: '55%',
        left: '85%'
      }
    }
  ];

  const getStatusColor = (status: Apartment['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'reserved':
        return 'bg-orange-100 text-orange-800';
      case 'sold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-neutral-200 text-neutral-700';
    }
  };

  const getStatusText = (status: Apartment['status']) => {
    switch (status) {
      case 'available':
        return 'Свободен';
      case 'reserved':
        return 'Резервиран';
      case 'sold':
        return 'Продаден';
      default:
        return '';
    }
  };

  const handleEntranceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEntrance = e.target.value;
    setSelectedEntrance(newEntrance);
  };

  const handleFloorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFloor = Number(e.target.value);
    setSelectedFloor(newFloor);
  };

  const filteredApartments = mockApartments.filter(
    apt => apt.entrance === selectedEntrance && apt.floor === selectedFloor
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex flex-col md:flex-row gap-8 justify-center mb-12">
        <div className="relative w-full md:w-64">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Изберете вход
          </label>
          <div className="relative">
            <select
              value={selectedEntrance}
              onChange={handleEntranceChange}
              className="block w-full pl-4 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-lg appearance-none bg-white"
            >
              {entrances.map((entrance) => (
                <option key={entrance} value={entrance}>
                  Вход {entrance}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="relative w-full md:w-64">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Изберете етаж
          </label>
          <div className="relative">
            <select
              value={selectedFloor}
              onChange={handleFloorChange}
              className="block w-full pl-4 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-lg appearance-none bg-white"
            >
              {floors.map((floor) => (
                <option key={floor} value={floor}>
                  Етаж {floor}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-9">
          <div className="aspect-video bg-neutral-100 rounded-lg shadow-inner p-4">
            <div className="relative w-full h-full">
              <img
                src="/images/floor-plan-1.png"
                alt={`Floor plan for entrance ${selectedEntrance}, floor ${selectedFloor}`}
                className="w-full h-full object-contain"
              />
              {filteredApartments.map((apt) => (
                <div
                  key={apt.id}
                  className={`absolute cursor-pointer transition-all duration-300 hover:scale-105 ${getStatusColor(
                    apt.status
                  )}`}
                  style={{
                    top: apt.position.top,
                    left: apt.position.left,
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                  }}
                  onMouseEnter={() => setHoveredApartment(apt)}
                  onMouseLeave={() => setHoveredApartment(null)}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <span className="font-medium">{apt.number}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-neutral-100 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Информация за апартамент</h3>
            {hoveredApartment ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Номер:</span>
                  <span className="font-semibold">{hoveredApartment.number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Вход:</span>
                  <span className="font-semibold">{hoveredApartment.entrance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Етаж:</span>
                  <span className="font-semibold">{hoveredApartment.floor}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Стаи:</span>
                  <span className="font-semibold">{hoveredApartment.rooms}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Площ:</span>
                  <span className="font-semibold">{hoveredApartment.area} м²</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Цена:</span>
                  <span className="font-semibold">
                    {hoveredApartment.price.toLocaleString()} лв.
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Статус:</span>
                  <span
                    className={`flex items-center ${
                      hoveredApartment.status === 'available'
                        ? 'text-green-800'
                        : hoveredApartment.status === 'reserved'
                        ? 'text-orange-800'
                        : 'text-red-800'
                    }`}
                  >
                    {hoveredApartment.status === 'available' && (
                      <Check className="w-4 h-4 mr-1" />
                    )}
                    {hoveredApartment.status === 'reserved' && (
                      <Clock className="w-4 h-4 mr-1" />
                    )}
                    {hoveredApartment.status === 'sold' && (
                      <X className="w-4 h-4 mr-1" />
                    )}
                    {getStatusText(hoveredApartment.status)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-neutral-500 text-center">
                Изберете апартамент от плана за повече информация
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-8">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-green-100 mr-2"></div>
          <span>Свободен</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-orange-100 mr-2"></div>
          <span>Резервиран</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-red-100 mr-2"></div>
          <span>Продаден</span>
        </div>
      </div>
    </div>
  );
};

export default FloorNavigator;