import React, { useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useApartments } from '../lib/hooks/useApartments';
import { useBuildingConfig } from '../lib/hooks/useBuildingConfig';
import { Link } from 'react-router-dom';

const ApartmentCatalog = () => {
  const { config: buildingConfig, getEntranceName, getEntranceLabel, getAvailableFloors, getApartmentTypeLabel } = useBuildingConfig();
  const [selectedEntrance, setSelectedEntrance] = useState<string>('всички');
  const [selectedFloor, setSelectedFloor] = useState<string>('всички');
  const [selectedType, setSelectedType] = useState<string>('всички');
  const [selectedStatus, setSelectedStatus] = useState<string>('всички');

  const { apartments, loading, error } = useApartments(
    selectedEntrance,
    selectedFloor,
    selectedType,
    selectedStatus
  );

  const getExposureText = (exposure: string) => {
    switch (exposure) {
      case 'north': return 'Север';
      case 'south': return 'Юг';
      case 'east': return 'Изток';
      case 'west': return 'Запад';
      case 'northeast': return 'Североизток';
      case 'northwest': return 'Северозапад';
      case 'southeast': return 'Югоизток';
      case 'southwest': return 'Югозапад';
      default: return exposure || '-';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container-custom">
        <h1 className="text-4xl font-bold text-center mb-12">Paradise Green Park</h1>
        <h2 className="text-2xl text-center mb-8">Апартаменти</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <select
              value={selectedEntrance}
              onChange={(e) => setSelectedEntrance(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8"
            >
              <option value="всички">Всички входове</option>
              {buildingConfig.entrances.map((entrance) => (
                <option key={entrance.id} value={entrance.id}>
                  {entrance.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8"
            >
              <option value="всички">Всички етажи</option>
              {getAvailableFloors(selectedEntrance === 'всички' ? undefined : selectedEntrance).map((floor) => (
                <option key={floor} value={String(floor)}>Етаж {floor}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8"
            >
              <option value="всички">Всички типове</option>
              {buildingConfig.apartmentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8"
            >
              <option value="всички">Статус</option>
              <option value="available">Свободен</option>
              <option value="reserved">Резервиран</option>
              <option value="sold">Продаден</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-secondary text-white">
                <th className="p-3 text-left">Вход</th>
                <th className="p-3 text-left">Апартамент</th>
                <th className="p-3 text-left">Етаж</th>
                <th className="p-3 text-left">Тип</th>
                <th className="p-3 text-left">Изложение</th>
                <th className="p-3 text-left">Чиста площ</th>
                <th className="p-3 text-left">Обща площ</th>
                <th className="p-3 text-left">Цена</th>
                <th className="p-3 text-left">Статус</th>
              </tr>
            </thead>
            <tbody>
              {apartments.map((apartment, index) => (
                <tr 
                  key={apartment.id}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors cursor-pointer`}
                  onClick={() => window.location.href = `/apartments/${apartment.id}`}
                >
                  <td className="p-3 border-b border-gray-200">{getEntranceLabel(apartment.entrance)}</td>
                  <td className="p-3 border-b border-gray-200">
                    <Link 
                      to={`/apartments/${apartment.id}`}
                      className="text-primary hover:text-primary-dark transition-colors"
                    >
                      {apartment.number}
                    </Link>
                  </td>
                  <td className="p-3 border-b border-gray-200">{apartment.floor}</td>
                  <td className="p-3 border-b border-gray-200">
                    {getApartmentTypeLabel(apartment.type)}
                  </td>
                  <td className="p-3 border-b border-gray-200">{getExposureText(apartment.exposure)}</td>
                  <td className="p-3 border-b border-gray-200">
                    {apartment.netArea ? `${apartment.netArea} кв.м` : '-'}
                  </td>
                  <td className="p-3 border-b border-gray-200">{apartment.area} кв.м</td>
                  <td className="p-3 border-b border-gray-200">
                    {apartment.price > 0 ? `€${apartment.price.toLocaleString()}` : ''}
                  </td>
                  <td className="p-3 border-b border-gray-200">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      apartment.status === 'available' 
                        ? 'bg-green-100 text-green-800'
                        : apartment.status === 'reserved'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {apartment.status === 'available' 
                        ? 'Свободен' 
                        : apartment.status === 'reserved'
                        ? 'Резервиран'
                        : 'Продаден'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {apartments.map((apartment) => (
            <Link
              key={apartment.id}
              to={`/apartments/${apartment.id}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="bg-secondary text-white px-4 py-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    Апартамент {apartment.number}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    apartment.status === 'available' 
                      ? 'bg-green-500 text-white'
                      : apartment.status === 'reserved'
                      ? 'bg-orange-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}>
                    {apartment.status === 'available' 
                      ? 'Свободен' 
                      : apartment.status === 'reserved'
                      ? 'Резервиран'
                      : 'Продаден'}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Вход:</span>
                    <span className="ml-2 font-medium">{getEntranceLabel(apartment.entrance)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Етаж:</span>
                    <span className="ml-2 font-medium">{apartment.floor}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Тип:</span>
                    <span className="ml-2 font-medium">{getApartmentTypeLabel(apartment.type)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Изложение:</span>
                    <span className="ml-2 font-medium">{getExposureText(apartment.exposure)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Чиста площ:</span>
                    <span className="ml-2 font-medium">
                      {apartment.netArea ? `${apartment.netArea} кв.м` : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Обща площ:</span>
                    <span className="ml-2 font-medium">{apartment.area} кв.м</span>
                  </div>
                </div>
                
                {apartment.price > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Цена:</span>
                      <span className="text-xl font-bold text-primary">
                        €{apartment.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApartmentCatalog;