import React, { useState } from 'react';
import { Store, Upload, Save, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { useStores } from '../../lib/hooks/useStores';
import { useDropzone } from 'react-dropzone';

interface StoreFormData {
  title: string;
  description: string;
}

const initialFormData: StoreFormData = {
  title: '',
  description: ''
};

const StoresEditor = () => {
  const { stores, loading, error, addStore, updateStore, deleteStore, uploadImage } = useStores();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<StoreFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentStoreId, setCurrentStoreId] = useState<string | null>(null);
  const [tempImage, setTempImage] = useState<File | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setTempImage(file);
      }
    }
  });

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      alert('Моля, попълнете всички задължителни полета');
      return;
    }

    try {
      setIsSaving(true);
      let storeId = editingId;

      if (!storeId || storeId === 'new') {
        const newStore = await addStore(formData);
        storeId = newStore.id;
        setEditingId(storeId);
      } else {
        await updateStore(storeId, formData);
      }

      setCurrentStoreId(storeId);

      // Upload image if one is selected
      if (tempImage && storeId) {
        try {
          setUploadingImage(true);
          await uploadImage(storeId, tempImage, 'main');
          setTempImage(null);
        } catch (error: any) {
          console.error('Error uploading image:', error);
          alert(error.message || 'Грешка при качване на снимката');
        } finally {
          setUploadingImage(false);
        }
      }
    } catch (error) {
      console.error('Error saving store:', error);
      alert('Грешка при запазване на обекта');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Сигурни ли сте, че искате да изтриете този обект?')) {
      try {
        await deleteStore(id);
        if (id === editingId) {
          setEditingId(null);
          setFormData(initialFormData);
          setCurrentStoreId(null);
          setTempImage(null);
        }
      } catch (error) {
        console.error('Error deleting store:', error);
        alert('Грешка при изтриване на обекта');
      }
    }
  };

  const handleEdit = (store: any) => {
    setEditingId(store.id);
    setCurrentStoreId(store.id);
    setFormData({
      title: store.title,
      description: store.description
    });
    setTempImage(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setCurrentStoreId(null);
    setTempImage(null);
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

  const currentStore = currentStoreId ? stores.find(s => s.id === currentStoreId) : null;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Store className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-2xl font-bold">Търговски обекти</h1>
        </div>
        {!editingId && (
          <button
            onClick={() => {
              setEditingId('new');
              setFormData(initialFormData);
              setCurrentStoreId(null);
              setTempImage(null);
            }}
            className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Store className="w-5 h-5 mr-2" />
            Добави обект
          </button>
        )}
      </div>

      {editingId && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заглавие
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Снимка
              </label>
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-primary hover:bg-primary/5'
                }`}
              >
                <input {...getInputProps()} />
                {tempImage ? (
                  <div className="w-24 h-24 mx-auto mb-4 relative">
                    <img
                      src={URL.createObjectURL(tempImage)}
                      alt="Предварителен преглед"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ) : currentStore?.mainImage ? (
                  <img
                    src={currentStore.mainImage}
                    alt="Снимка на обекта"
                    className="w-24 h-24 object-cover mx-auto mb-4 rounded"
                  />
                ) : (
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                )}
                <p className="text-sm text-gray-600">
                  {isDragActive
                    ? 'Пуснете снимката тук...'
                    : tempImage
                    ? 'Плъзнете нова снимка или кликнете, за да промените'
                    : currentStore?.mainImage
                    ? 'Плъзнете нова снимка или кликнете, за да промените'
                    : 'Плъзнете снимка тук или кликнете, за да изберете'}
                </p>
                {uploadingImage && (
                  <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отказ
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || uploadingImage}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving || uploadingImage ? (
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
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stores.map((store) => (
          <div key={store.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative aspect-video">
              {store.mainImage ? (
                <img 
                  src={store.mainImage} 
                  alt={store.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{store.title}</h2>
              <p className="text-neutral-600 mb-6">{store.description}</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleEdit(store)}
                  className="text-primary hover:text-primary-dark"
                  title="Редактирай"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(store.id)}
                  className="text-red-600 hover:text-red-900"
                  title="Изтрий"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoresEditor;