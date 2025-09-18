import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Car, Loader2, Upload } from 'lucide-react';
import { useParkingSpots } from '../../lib/hooks/useParkingSpots';
import { storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ParkingSpotFormData {
  number: string;
  floor: number;
  type: 'covered' | 'uncovered';
  size: string;
  price: number;
  status: 'available' | 'reserved' | 'sold';
  internalNotes?: string;
}

interface FloorImage {
  floor: number;
  imageUrl: string;
}

const initialFormData: ParkingSpotFormData = {
  number: '',
  floor: -1,
  type: 'covered',
  size: '2.5m x 5m',
  price: 7500,
  status: 'available',
  internalNotes: ''
};

const ParkingEditor = () => {
  const { parkingSpots, loading, error, addParkingSpot, updateParkingSpot, deleteParkingSpot } = useParkingSpots();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<ParkingSpotFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingFloor, setUploadingFloor] = useState<number | null>(null);

  const handleImageUpload = async (floor: number, file: File) => {
    try {
      setUploadingFloor(floor);
      const timestamp = Date.now();
      const storagePath = `parking/floor_${floor}_${timestamp}.jpg`;
      const storageRef = ref(storage, storagePath);
      
      await uploadBytes(storageRef, file, {
        customMetadata: {
          uploaded: new Date().toISOString(),
          uploadedBy: 'admin',
          floor: floor.toString()
        }
      });
      
      const imageUrl = await getDownloadURL(storageRef);
      console.log(`Image uploaded for floor ${floor}:`, imageUrl);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploadingFloor(null);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData(initialFormData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (spot: any) => {
    setEditingId(spot.id);
    setFormData({
      number: spot.number,
      floor: spot.floor,
      type: spot.type,
      size: spot.size,
      price: spot.price,
      status: spot.status,
      internalNotes: spot.internalNotes || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (id: string | null = null) => {
    try {
      setIsSaving(true);
      if (id) {
        await updateParkingSpot(id, formData);
      } else {
        await addParkingSpot(formData);
      }
      setEditingId(null);
      setIsAdding(false);
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error saving parking spot:', error);
      alert('Грешка при запазване на паркомястото');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Сигурни ли сте, че искате да изтриете това паркомясто?')) {
      try {
        await deleteParkingSpot(id);
      } catch (error) {
        console.error('Error deleting parking spot:', error);
        alert('Грешка при изтриване на паркомястото');
      }
    }
  };

  const FloorImageUploader = ({ floor, label }: { floor: number; label: string }) => (
    <div className="mb-6 p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-medium mb-4">{label}</h3>
      <label className="block">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleImageUpload(floor, file);
            }
          }}
        />
        <div className={`flex items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors ${uploadingFloor === floor ? 'opacity-50' : ''}`}>
          {uploadingFloor === floor ? (
            <div className="flex items-center">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Click to upload floor plan</span>
            </div>
          )}
        </div>
      </label>
    </div>
  );

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
        <p>Грешка при зареждане на паркоместата: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Car className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-2xl font-bold">Управление на паркоместа</h1>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={handleAdd}
            className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Добави паркомясто
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <FloorImageUploader floor={-1} label="Подземен етаж" />
        <FloorImageUploader floor={1} label="Етаж 1" />
        <FloorImageUploader floor={2} label="Етаж 2" />
      </div>

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
                Етаж
              </label>
              <input
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'covered' | 'uncovered' })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="covered">Закрито</option>
                <option value="uncovered">Открито</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Размери
              </label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Цена (EUR)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
                min="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'available' | 'reserved' | 'sold' })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="available">Свободно</option>
                <option value="reserved">Резервирано</option>
                <option value="sold">Продадено</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Вътрешни бележки
              </label>
              <textarea
                value={formData.internalNotes}
                onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Вътрешни бележки, видими само в административния панел..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={() => {
                setEditingId(null);
                setIsAdding(false);
                setFormData(initialFormData);
              }}
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

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Номер
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Етаж
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Тип
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Размери
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Цена
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Бележки
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {parkingSpots.map((spot) => (
              <tr key={spot.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">{spot.number}</td>
                <td className="px-6 py-4 whitespace-nowrap">{spot.floor}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {spot.type === 'covered' ? 'Закрито' : 'Открито'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{spot.size}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  €{spot.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      spot.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : spot.status === 'reserved'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {spot.status === 'available'
                      ? 'Свободно'
                      : spot.status === 'reserved'
                      ? 'Резервирано'
                      : 'Продадено'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="max-w-xs truncate">
                    {spot.internalNotes || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(spot)}
                    className="text-primary hover:text-primary-dark mr-3 transition-colors"
                    title="Редактирай"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(spot.id)}
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
  );
};

export default ParkingEditor;