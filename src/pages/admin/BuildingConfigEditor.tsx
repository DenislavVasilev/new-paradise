import React, { useState } from 'react';
import { Building2, Plus, Trash2, Save, Pencil, X, Loader2, Home } from 'lucide-react';
import { useBuildingConfig, Entrance, ApartmentType } from '../../lib/hooks/useBuildingConfig';

interface EntranceFormData {
  name: string;
  label: string;
  floors: number[];
}

interface ApartmentTypeFormData {
  name: string;
  label: string;
  rooms: number;
}

const initialFormData: EntranceFormData = {
  name: '',
  label: '',
  floors: []
};

const initialApartmentTypeFormData: ApartmentTypeFormData = {
  name: '',
  label: '',
  rooms: 1
};

const BuildingConfigEditor = () => {
  const {
    config,
    loading,
    error,
    addEntrance,
    updateEntrance,
    removeEntrance,
    addApartmentType,
    updateApartmentType,
    removeApartmentType
  } = useBuildingConfig();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingType, setIsAddingType] = useState(false);
  const [formData, setFormData] = useState<EntranceFormData>(initialFormData);
  const [typeFormData, setTypeFormData] = useState<ApartmentTypeFormData>(initialApartmentTypeFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [floorInput, setFloorInput] = useState('');
  const [activeTab, setActiveTab] = useState<'entrances' | 'apartmentTypes'>('entrances');

  const handleEdit = (entrance: Entrance) => {
    setEditingId(entrance.id);
    setFormData({
      name: entrance.name,
      label: entrance.label,
      floors: [...entrance.floors]
    });
    setFloorInput(entrance.floors.join(', '));
  };

  const handleEditType = (apartmentType: ApartmentType) => {
    setEditingTypeId(apartmentType.id);
    setTypeFormData({
      name: apartmentType.name,
      label: apartmentType.label,
      rooms: apartmentType.rooms
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.label.trim()) {
      alert('Моля, попълнете всички задължителни полета');
      return;
    }

    try {
      setIsSaving(true);
      
      if (editingId) {
        await updateEntrance(editingId, formData);
      } else {
        await addEntrance(formData);
      }
      
      handleCancel();
    } catch (error) {
      console.error('Error saving entrance:', error);
      alert('Грешка при запазване на входа');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveType = async () => {
    if (!typeFormData.name.trim() || !typeFormData.label.trim()) {
      alert('Моля, попълнете всички задължителни полета');
      return;
    }

    try {
      setIsSaving(true);
      
      if (editingTypeId) {
        await updateApartmentType(editingTypeId, typeFormData);
      } else {
        await addApartmentType(typeFormData);
      }
      
      handleCancelType();
    } catch (error) {
      console.error('Error saving apartment type:', error);
      alert('Грешка при запазване на типа апартамент');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData(initialFormData);
    setFloorInput('');
  };

  const handleCancelType = () => {
    setEditingTypeId(null);
    setIsAddingType(false);
    setTypeFormData(initialApartmentTypeFormData);
  };

  const handleDelete = async (entranceId: string) => {
    if (config.entrances.length <= 1) {
      alert('Не можете да изтриете последния вход');
      return;
    }

    if (window.confirm('Сигурни ли сте, че искате да изтриете този вход?')) {
      try {
        await removeEntrance(entranceId);
      } catch (error) {
        console.error('Error deleting entrance:', error);
        alert('Грешка при изтриване на входа');
      }
    }
  };

  const handleDeleteType = async (typeId: string) => {
    if (config.apartmentTypes.length <= 1) {
      alert('Не можете да изтриете последния тип апартамент');
      return;
    }

    if (window.confirm('Сигурни ли сте, че искате да изтриете този тип апартамент?')) {
      try {
        await removeApartmentType(typeId);
      } catch (error) {
        console.error('Error deleting apartment type:', error);
        alert('Грешка при изтриване на типа апартамент');
      }
    }
  };

  const parseFloors = (input: string): number[] => {
    const floors = input
      .split(',')
      .map(f => parseInt(f.trim()))
      .filter(f => !isNaN(f) && f > 0)
      .sort((a, b) => a - b);
    
    return [...new Set(floors)]; // Remove duplicates
  };

  const handleFloorInputChange = (value: string) => {
    setFloorInput(value);
    const floors = parseFloors(value);
    setFormData(prev => ({ ...prev, floors }));
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Building2 className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-2xl font-bold">Конфигурация на сградата</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('entrances')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'entrances'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Building2 className="w-5 h-5 inline mr-2" />
          Входове
        </button>
        <button
          onClick={() => setActiveTab('apartmentTypes')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'apartmentTypes'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Home className="w-5 h-5 inline mr-2" />
          Типове апартаменти
        </button>
      </div>

      {activeTab === 'entrances' && (
        <>
          <div className="flex justify-end mb-6">
            {!isAdding && !editingId && (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Добави вход
              </button>
            )}
          </div>

          {(isAdding || editingId) && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">
                {editingId ? 'Редактиране на вход' : 'Добавяне на нов вход'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Име на входа *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="напр. Вход А"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Етикет (кратко име) *
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="напр. А"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Етажи (разделени със запетая)
                  </label>
                  <input
                    type="text"
                    value={floorInput}
                    onChange={(e) => handleFloorInputChange(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="напр. 1, 2, 3, 4, 5"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Въведете номерата на етажите, разделени със запетая
                  </p>
                  {formData.floors.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-600">Етажи: </span>
                      <span className="text-sm font-medium">
                        {formData.floors.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отказ
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Запазване...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Запази
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Име на входа
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Етикет
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Етажи
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {config.entrances.map((entrance) => (
                  <tr key={entrance.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {entrance.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entrance.label}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="max-w-xs">
                        {entrance.floors.join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(entrance)}
                        className="text-primary hover:text-primary-dark mr-3 transition-colors"
                        title="Редактирай"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(entrance.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Изтрий"
                        disabled={config.entrances.length <= 1}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'apartmentTypes' && (
        <>
          <div className="flex justify-end mb-6">
            {!isAddingType && !editingTypeId && (
              <button
                onClick={() => setIsAddingType(true)}
                className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Добави тип апартамент
              </button>
            )}
          </div>

          {(isAddingType || editingTypeId) && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">
                {editingTypeId ? 'Редактиране на тип апартамент' : 'Добавяне на нов тип апартамент'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Име на типа *
                  </label>
                  <input
                    type="text"
                    value={typeFormData.name}
                    onChange={(e) => setTypeFormData({ ...typeFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="напр. Двустаен"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Етикет *
                  </label>
                  <input
                    type="text"
                    value={typeFormData.label}
                    onChange={(e) => setTypeFormData({ ...typeFormData, label: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="напр. 2-стаен"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Брой стаи *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={typeFormData.rooms}
                    onChange={(e) => setTypeFormData({ ...typeFormData, rooms: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={handleCancelType}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отказ
                </button>
                <button
                  onClick={handleSaveType}
                  disabled={isSaving}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Запазване...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Запази
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Име на типа
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Етикет
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Брой стаи
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {config.apartmentTypes.map((type) => (
                  <tr key={type.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {type.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {type.label}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {type.rooms}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditType(type)}
                        className="text-primary hover:text-primary-dark mr-3 transition-colors"
                        title="Редактирай"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteType(type.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Изтрий"
                        disabled={config.apartmentTypes.length <= 1}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Информация:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Промените ще се отразят автоматично в публичната част на сайта</li>
          <li>• Филтрите за входове, етажи и типове ще показват само наличните опции</li>
          <li>• Трябва да има поне един вход и един тип апартамент в конфигурацията</li>
        </ul>
      </div>
    </div>
  );
};

export default BuildingConfigEditor;