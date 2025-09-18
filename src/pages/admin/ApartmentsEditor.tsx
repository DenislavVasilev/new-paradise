import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Plus, Pencil, Trash2, Save, X, Building2, Loader2, Upload, Image as ImageIcon, Star, ChevronDown, FileText, Download, Filter } from 'lucide-react';
import { useApartments } from '../../lib/hooks/useApartments';
import { useBuildingConfig } from '../../lib/hooks/useBuildingConfig';
import Input from '../../components/Input';

interface ApartmentFormData {
  number: string;
  entrance: string;
  floor: number;
  secondaryFloor?: number | null;
  type: string;
  rooms: number;
  area: number;
  netArea?: number;
  price: number;
  status: 'available' | 'reserved' | 'sold';
  description: string;
  features: string[];
  exposure: string;
  internalNotes?: string;
}

const initialFormData: ApartmentFormData = {
  number: '',
  entrance: '1',
  floor: 1,
  secondaryFloor: null,
  type: 'studio',
  rooms: 1,
  area: 0,
  netArea: 0,
  price: 0,
  status: 'available',
  description: '',
  features: [],
  exposure: 'south',
  internalNotes: ''
};

const ApartmentsEditor = () => {
  const { config: buildingConfig, getAvailableFloors, getEntranceLabel, getApartmentTypeLabel } = useBuildingConfig();
  const { 
    apartments, 
    loading, 
    error, 
    addApartment, 
    updateApartment, 
    deleteApartment,
    addImages,
    deleteImage,
    setMainImage,
    uploadProgress,
    uploadBrochure,
    deleteBrochure,
    refreshApartments
  } = useApartments();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<ApartmentFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  
  const [filters, setFilters] = useState({
    entrance: 'all',
    floor: 'all',
    type: 'all',
    status: 'all'
  });

  const isMaisonette = (type: string) => {
    return type.includes('maisonette');
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      type: value,
      secondaryFloor: isMaisonette(value) ? (prev.floor + 1) : null
    }));
  };

  const handleInputChange = (field: keyof ApartmentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (id: string | null = null) => {
    try {
      setIsSaving(true);
      if (id) {
        await updateApartment(id, formData);
      } else {
        await addApartment(formData);
      }
      setEditingId(null);
      setIsAdding(false);
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error saving apartment:', error);
      alert('Грешка при запазване на апартамента');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Сигурни ли сте, че искате да изтриете този апартамент?')) {
      try {
        await deleteApartment(id);
      } catch (error) {
        console.error('Error deleting apartment:', error);
        alert('Грешка при изтриване на апартамента');
      }
    }
  };

  const handleEdit = (apartment: any) => {
    setEditingId(apartment.id);
    setFormData({
      number: apartment.number,
      entrance: apartment.entrance,
      floor: apartment.floor,
      secondaryFloor: apartment.secondaryFloor,
      type: apartment.type,
      rooms: apartment.rooms,
      area: apartment.area,
      netArea: apartment.netArea || 0,
      price: apartment.price,
      status: apartment.status,
      description: apartment.description || '',
      features: apartment.features || [],
      exposure: apartment.exposure || 'south',
      internalNotes: apartment.internalNotes || ''
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData(initialFormData);
    setShowImageUpload(false);
  };

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      if (!editingId) return;
      
      try {
        await addImages(editingId, acceptedFiles);
      } catch (error) {
        console.error('Error uploading images:', error);
        alert('Грешка при качване на снимките');
      }
    }
  });

  const handleDeleteImage = async (apartmentId: string, imageUrl: string) => {
    if (window.confirm('Сигурни ли сте, че искате да изтриете тази снимка?')) {
      try {
        await deleteImage(apartmentId, imageUrl);
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Грешка при изтриване на снимката');
      }
    }
  };

  const handleSetMainImage = async (apartmentId: string, imageUrl: string) => {
    try {
      await setMainImage(apartmentId, imageUrl);
    } catch (error) {
      console.error('Error setting main image:', error);
      alert('Грешка при задаване на главна снимка');
    }
  };

  const filteredApartments = apartments.filter(apartment => {
    return (
      (filters.entrance === 'all' || apartment.entrance === filters.entrance) &&
      (filters.floor === 'all' || apartment.floor === parseInt(filters.floor)) &&
      (filters.type === 'all' || apartment.type === filters.type) &&
      (filters.status === 'all' || apartment.status === filters.status)
    );
  });

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
          <h1 className="text-2xl font-bold">Управление на апартаменти</h1>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Добави апартамент
          </button>
        )}
      </div>

      {!isAdding && !editingId && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Филтри</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Вход
              </label>
              <select
                value={filters.entrance}
                onChange={(e) => setFilters(prev => ({ ...prev, entrance: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">Всички</option>
                {buildingConfig.entrances.map((entrance) => (
                  <option key={entrance.id} value={entrance.id}>
                    {entrance.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Етаж
              </label>
              <select
                value={filters.floor}
                onChange={(e) => setFilters(prev => ({ ...prev, floor: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">Всички</option>
                {getAvailableFloors().map((floor) => (
                  <option key={floor} value={floor}>Етаж {floor}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">Всички</option>
                {buildingConfig.apartmentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">Статус</option>
                <option value="available">Свободен</option>
                <option value="reserved">Резервиран</option>
                <option value="sold">Продаден</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {(isAdding || editingId) && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Номер
              </label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Вход
              </label>
              <select
                value={formData.entrance}
                onChange={(e) => handleInputChange('entrance', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {buildingConfig.entrances.map((entrance) => (
                  <option key={entrance.id} value={entrance.id}>
                    {entrance.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {buildingConfig.apartmentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Етаж
              </label>
              <select
                value={formData.floor}
                onChange={(e) => {
                  const newFloor = Number(e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    floor: newFloor,
                    secondaryFloor: isMaisonette(prev.type) ? newFloor + 1 : null
                  }));
                }}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {getAvailableFloors(formData.entrance).map((floor) => (
                  <option key={floor} value={floor}>Етаж {floor}</option>
                ))}
              </select>
            </div>

            {isMaisonette(formData.type) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Втори етаж
                </label>
                <select
                  value={formData.secondaryFloor || ''}
                  onChange={(e) => setFormData({ ...formData, secondaryFloor: Number(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {getAvailableFloors(formData.entrance).map((floor) => (
                    <option key={floor} value={floor}>Етаж {floor}</option>
                  ))}
                </select>
              </div>
            )}

            <Input
              label="Брой стаи"
              type="number"
              min="1"
              value={formData.rooms}
              onChange={(e) => handleInputChange('rooms', Number(e.target.value))}
              required
            />

            <Input
              label="Чиста площ (кв.м)"
              type="number"
              min="0"
              step="0.01"
              value={formData.netArea || 0}
              onChange={(e) => handleInputChange('netArea', Number(e.target.value))}
            />

            <Input
              label="Обща площ (кв.м)"
              type="number"
              min="0"
              step="0.01"
              value={formData.area}
              onChange={(e) => handleInputChange('area', Number(e.target.value))}
              required
            />

            <Input
              label="Цена (EUR)"
              type="number"
              min="0"
              value={formData.price}
              onChange={(e) => handleInputChange('price', Number(e.target.value))}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as 'available' | 'reserved' | 'sold')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="available">Свободен</option>
                <option value="reserved">Резервиран</option>
                <option value="sold">Продаден</option>
              </select>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Изложение
              </label>
              <select
                value={formData.exposure}
                onChange={(e) => handleInputChange('exposure', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="north">Север</option>
                <option value="south">Юг</option>
                <option value="east">Изток</option>
                <option value="west">Запад</option>
                <option value="northeast">Североизток</option>
                <option value="northwest">Северозапад</option>
                <option value="southeast">Югоизток</option>
                <option value="southwest">Югозапад</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Описание на апартамента..."
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Вътрешни бележки
            </label>
            <textarea
              value={formData.internalNotes || ''}
              onChange={(e) => handleInputChange('internalNotes', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Вътрешни бележки (не се показват на клиентите)..."
            />
          </div>

          {editingId && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Снимки
                </label>
                <button
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  className="flex items-center px-4 py-2 text-primary hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <ImageIcon className="w-5 h-5 mr-2" />
                  {showImageUpload ? 'Скрий качването' : 'Качи снимки'}
                </button>
              </div>

              {showImageUpload && (
                <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors mb-6">
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {isDragActive
                      ? 'Пуснете снимките тук...'
                      : 'Плъзнете снимки тук или кликнете, за да изберете'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Поддържани формати: PNG, JPG, JPEG, WEBP
                  </p>
                </div>
              )}

              {editingId && apartments.find(apt => apt.id === editingId)?.images && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {apartments.find(apt => apt.id === editingId)?.images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Апартамент ${formData.number} - ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleSetMainImage(editingId, imageUrl)}
                          className={`p-2 rounded-full ${
                            apartments.find(apt => apt.id === editingId)?.mainImage === imageUrl
                              ? 'bg-yellow-500 text-white'
                              : 'bg-white text-gray-800'
                          } hover:bg-yellow-500 hover:text-white transition-colors`}
                          title={apartments.find(apt => apt.id === editingId)?.mainImage === imageUrl ? 'Главна снимка' : 'Задай като главна'}
                        >
                          <Star className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteImage(editingId, imageUrl)}
                          className="p-2 bg-white text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-colors"
                          title="Изтрий"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      {uploadProgress[imageUrl] !== undefined && uploadProgress[imageUrl] < 100 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="text-white">
                            {uploadProgress[imageUrl]}%
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Брошура (PDF)
            </label>
            <div className="flex items-center space-x-4">
              {editingId && apartments.find(apt => apt.id === editingId)?.brochureUrl ? (
                <div className="flex items-center justify-between w-full bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Брошура</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={apartments.find(apt => apt.id === editingId)?.brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-primary hover:text-primary-dark transition-colors"
                      title="Изтегли"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => {
                        if (editingId && apartments.find(apt => apt.id === editingId)?.brochureUrl) {
                          if (window.confirm('Сигурни ли сте, че искате да изтриете брошурата?')) {
                            deleteBrochure(editingId, apartments.find(apt => apt.id === editingId)!.brochureUrl!);
                          }
                        }
                      }}
                      className="p-2 text-red-600 hover:text-red-900 transition-colors"
                      title="Изтрий"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex-1">
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file && editingId) {
                        try {
                          await uploadBrochure(editingId, file);
                          await refreshApartments();
                        } catch (error) {
                          console.error('Error uploading brochure:', error);
                          alert('Error uploading brochure');
                        }
                      }
                    }}
                  />
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      Качете PDF брошура
                    </span>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Характеристики
            </label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...formData.features];
                      newFeatures[index] = e.target.value;
                      handleInputChange('features', newFeatures);
                    }}
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <button
                    onClick={() => {
                      const newFeatures = formData.features.filter((_, i) => i !== index);
                      handleInputChange('features', newFeatures);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleInputChange('features', [...formData.features, ''])}
                className="flex items-center px-4 py-2 text-primary hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добави характеристика
              </button>
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
              onClick={() => handleSave(editingId)}
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

      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        <div className="min-w-[1400px]">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Вход
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Апартамент
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Етаж
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Изложение
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Чиста площ
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Обща площ
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Цена
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApartments.map((apartment) => (
                <tr key={apartment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{getEntranceLabel(apartment.entrance)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{apartment.number}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {apartment.floor}
                    {apartment.secondaryFloor && ` - ${apartment.secondaryFloor}`}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {getApartmentTypeLabel(apartment.type)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {getExposureText(apartment.exposure)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {apartment.netArea ? `${apartment.netArea} кв.м` : '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{apartment.area} кв.м</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {apartment.price > 0 ? `€${apartment.price.toLocaleString()}` : ''}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => handleEdit(apartment)}
                      className="text-primary hover:text-primary-dark mr-3 transition-colors"
                      title="Редактирай"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(apartment.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Изтрий"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApartmentsEditor;