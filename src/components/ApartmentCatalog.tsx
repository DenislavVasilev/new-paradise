import React, { useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useApartments } from '../lib/hooks/useApartments';
import { useBuildingConfig } from '../lib/hooks/useBuildingConfig';
import { Link } from 'react-router-dom';

const ApartmentCatalog = () => {
  const { config: buildingConfig, getEntranceName, getEntranceLabel, getAvailableFloors } = useBuildingConfig();
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

  const getEntranceLabel = (entrance: string) => {
    return buildingConfig.getEntranceLabel(entrance);
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
              <option value="studio">Студио</option>
              <option value="1-bedroom">Едностаен</option>
              <option value="2-bedroom">Двустаен</option>
              <option value="2-bedroom-maisonette">Двустаен мезонет</option>
              <option value="3-bedroom">Тристаен</option>
              <option value="3-bedroom-maisonette">Тристаен мезонет</option>
              <option value="4-bedroom-maisonette">Четиристаен мезонет</option>
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

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary text-white">
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
                    {apartment.type === 'studio' && 'Студио'}
                    {apartment.type === '1-bedroom' && 'Едностаен'}
                    {apartment.type === '2-bedroom' && 'Двустаен'}
                    {apartment.type === '2-bedroom-maisonette' && 'Двустаен мезонет'}
                    {apartment.type === '3-bedroom' && 'Тристаен'}
                    {apartment.type === '3-bedroom-maisonette' && 'Тристаен мезонет'}
                    {apartment.type === '4-bedroom-maisonette' && 'Четиристаен мезонет'}
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
      </div>
    </section>
  );
};

export default ApartmentCatalog;