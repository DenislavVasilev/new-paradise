import React, { useState } from 'react';
import { Home, Save, Plus, Trash2, GripVertical, Loader2, Upload, Image as ImageIcon, Palette } from 'lucide-react';
import { useHomepageContent, BenefitItem, ProjectFeature } from '../../lib/hooks/useHomepageContent';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';

const availableIcons = [
  'Waves', 'Utensils', 'TreePine', 'Shield', 'Car', 'Dumbbell', 'Baby', 'Users', 
  'Coffee', 'Gamepad2', 'Wifi', 'Building2', 'MapPin', 'Star', 'Sun', 'Moon',
  'Heart', 'Zap', 'Award', 'Gift', 'Music', 'Camera', 'Phone', 'Mail'
];

const availableColors = [
  { value: 'text-primary', label: 'Зелен', color: 'bg-primary' },
  { value: 'text-blue-500', label: 'Син', color: 'bg-blue-500' },
  { value: 'text-green-500', label: 'Светло зелен', color: 'bg-green-500' },
  { value: 'text-amber-500', label: 'Жълт', color: 'bg-amber-500' },
  { value: 'text-red-500', label: 'Червен', color: 'bg-red-500' },
  { value: 'text-purple-500', label: 'Лилав', color: 'bg-purple-500' },
  { value: 'text-orange-500', label: 'Оранжев', color: 'bg-orange-500' },
  { value: 'text-cyan-500', label: 'Циан', color: 'bg-cyan-500' },
  { value: 'text-pink-500', label: 'Розов', color: 'bg-pink-500' },
  { value: 'text-indigo-500', label: 'Индиго', color: 'bg-indigo-500' }
];
const HomepageEditor = () => {
  const {
    content,
    loading,
    error,
    updateHero,
    updateProjectInfo,
    updateProjectFeature,
    addProjectFeature,
    removeProjectFeature,
    reorderProjectFeatures,
    updateBenefit,
    addBenefit,
    removeBenefit,
    reorderBenefits
  } = useHomepageContent();

  const [activeTab, setActiveTab] = useState<'hero' | 'benefits' | 'projectInfo'>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<string | null>(null);
  const [editingFeature, setEditingFeature] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [draggedFeature, setDraggedFeature] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [editForm, setEditForm] = useState({
    icon: 'Waves',
    title: '',
    description: ''
  });

  const [heroForm, setHeroForm] = useState({
    title: content.hero.title,
    subtitle: content.hero.subtitle,
    buttonText: content.hero.buttonText,
    backgroundImage: content.hero.backgroundImage
  });

  const [projectInfoForm, setProjectInfoForm] = useState({
    title: content.projectInfo.title,
    subtitle: content.projectInfo.subtitle,
    description: content.projectInfo.description
  });

  const [benefitForm, setBenefitForm] = useState({
    icon: 'Waves',
    title: '',
    description: ''
  });

  const [featureForm, setFeatureForm] = useState({
    icon: 'Building2',
    title: '',
    description: '',
    iconColor: 'text-primary'
  });

  const [editFeatureForm, setEditFeatureForm] = useState({
    icon: 'Building2',
    title: '',
    description: '',
    iconColor: 'text-primary'
  });
  React.useEffect(() => {
    if (!loading) {
      setHeroForm({
        title: content.hero.title,
        subtitle: content.hero.subtitle,
        buttonText: content.hero.buttonText,
        backgroundImage: content.hero.backgroundImage
      });
      setProjectInfoForm({
        title: content.projectInfo.title,
        subtitle: content.projectInfo.subtitle,
        description: content.projectInfo.description
      });
    }
  }, [content, loading]);

  // Update editForm when editingBenefit changes
  React.useEffect(() => {
    if (editingBenefit) {
      const benefit = content.benefits.find(b => b.id === editingBenefit);
      if (benefit) {
        setEditForm({
          icon: benefit.icon,
          title: benefit.title,
          description: benefit.description
        });
      }
    }
  }, [editingBenefit, content.benefits]);

  // Update editFeatureForm when editingFeature changes
  React.useEffect(() => {
    if (editingFeature) {
      const feature = content.projectInfo.features.find(f => f.id === editingFeature);
      if (feature) {
        setEditFeatureForm({
          icon: feature.icon,
          title: feature.title,
          description: feature.description,
          iconColor: feature.iconColor
        });
      }
    }
  }, [editingFeature, content.projectInfo.features]);
  const handleSaveHero = async () => {
    setIsSaving(true);
    try {
      await updateHero(heroForm);
      alert('Hero секцията е запазена успешно!');
    } catch (error) {
      alert('Грешка при запазване');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProjectInfo = async () => {
    setIsSaving(true);
    try {
      await updateProjectInfo(projectInfoForm);
      alert('Информацията за проекта е запазена успешно!');
    } catch (error) {
      alert('Грешка при запазване');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBenefit = async (benefitId: string, data: Partial<BenefitItem>) => {
    setIsSaving(true);
    try {
      await updateBenefit(benefitId, data);
      setEditingBenefit(null);
    } catch (error) {
      alert('Грешка при запазване');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFeature = async (featureId: string, data: Partial<ProjectFeature>) => {
    setIsSaving(true);
    try {
      await updateProjectFeature(featureId, data);
      setEditingFeature(null);
    } catch (error) {
      alert('Грешка при запазване');
    } finally {
      setIsSaving(false);
    }
  };
  const handleAddBenefit = async () => {
    if (!benefitForm.title || !benefitForm.description) {
      alert('Моля, попълнете всички полета');
      return;
    }

    setIsSaving(true);
    try {
      await addBenefit(benefitForm);
      setBenefitForm({ icon: 'Waves', title: '', description: '' });
      alert('Предимството е добавено успешно!');
    } catch (error) {
      alert('Грешка при добавяне');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddFeature = async () => {
    if (!featureForm.title || !featureForm.description) {
      alert('Моля, попълнете всички полета');
      return;
    }

    setIsSaving(true);
    try {
      await addProjectFeature(featureForm);
      setFeatureForm({ icon: 'Building2', title: '', description: '', iconColor: 'text-primary' });
      alert('Характеристиката е добавена успешно!');
    } catch (error) {
      alert('Грешка при добавяне');
    } finally {
      setIsSaving(false);
    }
  };
  const handleDeleteBenefit = async (benefitId: string) => {
    if (window.confirm('Сигурни ли сте, че искате да изтриете това предимство?')) {
      setIsSaving(true);
      try {
        await removeBenefit(benefitId);
      } catch (error) {
        alert('Грешка при изтриване');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDeleteFeature = async (featureId: string) => {
    if (window.confirm('Сигурни ли сте, че искате да изтриете тази характеристика?')) {
      setIsSaving(true);
      try {
        await removeProjectFeature(featureId);
      } catch (error) {
        alert('Грешка при изтриване');
      } finally {
        setIsSaving(false);
      }
    }
  };
  const handleDragStart = (e: React.DragEvent, benefitId: string) => {
    setDraggedItem(benefitId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetId) return;

    const benefits = [...content.benefits];
    const draggedIndex = benefits.findIndex(b => b.id === draggedItem);
    const targetIndex = benefits.findIndex(b => b.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [draggedBenefit] = benefits.splice(draggedIndex, 1);
    benefits.splice(targetIndex, 0, draggedBenefit);

    setIsSaving(true);
    try {
      await reorderBenefits(benefits);
    } catch (error) {
      alert('Грешка при преподреждане');
    } finally {
      setIsSaving(false);
      setDraggedItem(null);
    }
  };

  const handleFeatureDragStart = (e: React.DragEvent, featureId: string) => {
    setDraggedFeature(featureId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleFeatureDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedFeature || draggedFeature === targetId) return;

    const features = [...content.projectInfo.features];
    const draggedIndex = features.findIndex(f => f.id === draggedFeature);
    const targetIndex = features.findIndex(f => f.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [draggedFeatureItem] = features.splice(draggedIndex, 1);
    features.splice(targetIndex, 0, draggedFeatureItem);

    setIsSaving(true);
    try {
      await reorderProjectFeatures(features);
    } catch (error) {
      alert('Грешка при преподреждане');
    } finally {
      setIsSaving(false);
      setDraggedFeature(null);
    }
  };
  const uploadBackgroundImage = async (file: File) => {
    try {
      setUploadingImage(true);
      const timestamp = Date.now();
      const safeFileName = encodeURIComponent(file.name).replace(/%/g, '_');
      const path = `homepage/hero_${timestamp}_${safeFileName}`;
      const storageRef = ref(storage, path);

      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      
      setHeroForm(prev => ({ ...prev, backgroundImage: downloadUrl }));
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Грешка при качване на снимката');
    } finally {
      setUploadingImage(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        await uploadBackgroundImage(file);
      }
    }
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
          <Home className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-2xl font-bold">Управление на началната страница</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'hero'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Hero секция
        </button>
        <button
          onClick={() => setActiveTab('benefits')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'benefits'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Предимства
        </button>
        <button
          onClick={() => setActiveTab('projectInfo')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'projectInfo'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Информация за проекта
        </button>
      </div>

      {/* Hero Tab */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Hero секция</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заглавие
              </label>
              <input
                type="text"
                value={heroForm.title}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Подзаглавие
              </label>
              <textarea
                value={heroForm.subtitle}
                onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Текст на бутона
              </label>
              <input
                type="text"
                value={heroForm.buttonText}
                onChange={(e) => setHeroForm({ ...heroForm, buttonText: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Фонова снимка
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
                {heroForm.backgroundImage ? (
                  <div className="space-y-4">
                    <img
                      src={heroForm.backgroundImage}
                      alt="Фонова снимка"
                      className="w-32 h-20 object-cover mx-auto rounded"
                    />
                    <p className="text-sm text-gray-600">
                      Плъзнете нова снимка или кликнете, за да промените
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600">
                      {isDragActive
                        ? 'Пуснете снимката тук...'
                        : 'Плъзнете снимка тук или кликнете, за да изберете'}
                    </p>
                  </>
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveHero}
                disabled={isSaving}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center disabled:opacity-50"
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
        </div>
      )}

      {/* Benefits Tab */}
      {activeTab === 'benefits' && (
        <div className="space-y-6">
          {/* Add new benefit */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Добави ново предимство</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Икона
                </label>
                <select
                  value={benefitForm.icon}
                  onChange={(e) => setBenefitForm({ ...benefitForm, icon: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {availableIcons.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Заглавие
                </label>
                <input
                  type="text"
                  value={benefitForm.title}
                  onChange={(e) => setBenefitForm({ ...benefitForm, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <input
                  type="text"
                  value={benefitForm.description}
                  onChange={(e) => setBenefitForm({ ...benefitForm, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <button
              onClick={handleAddBenefit}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors disabled:opacity-50"
            >
              <Plus className="w-5 h-5 mr-2" />
              Добави предимство
            </button>
          </div>

          {/* Existing benefits */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Съществуващи предимства</h2>
            
            <div className="space-y-4">
              {content.benefits
                .sort((a, b) => a.order - b.order)
                .map((benefit) => (
                <div
                  key={benefit.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, benefit.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, benefit.id)}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-move"
                >
                  <div className="flex items-center space-x-4">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium">{benefit.title}</div>
                      <div className="text-sm text-gray-500">{benefit.description}</div>
                      <div className="text-xs text-gray-400">Икона: {benefit.icon}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingBenefit(benefit.id)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBenefit(benefit.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Project Info Tab */}
      {activeTab === 'projectInfo' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Информация за проекта</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заглавие
              </label>
              <input
                type="text"
                value={projectInfoForm.title}
                onChange={(e) => setProjectInfoForm({ ...projectInfoForm, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Подзаглавие
              </label>
              <input
                type="text"
                value={projectInfoForm.subtitle}
                onChange={(e) => setProjectInfoForm({ ...projectInfoForm, subtitle: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                value={projectInfoForm.description}
                onChange={(e) => setProjectInfoForm({ ...projectInfoForm, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveProjectInfo}
                disabled={isSaving}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center disabled:opacity-50"
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
        </div>
      )}

      {/* Edit Benefit Modal */}
      {editingBenefit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Редактиране на предимство</h3>
            
            <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Икона
                    </label>
                    <select
                      value={editForm.icon}
                      onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      {availableIcons.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Заглавие
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Описание
                    </label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setEditingBenefit(null)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Отказ
                    </button>
                    <button
                      onClick={() => handleSaveBenefit(editingBenefit, editForm)}
                      disabled={isSaving}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                      Запази
                    </button>
                  </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Feature Modal */}
      {editingFeature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Редактиране на характеристика</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Икона
                </label>
                <select
                  value={editFeatureForm.icon}
                  onChange={(e) => setEditFeatureForm({ ...editFeatureForm, icon: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {availableIcons.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Цвят на иконата
                </label>
                <select
                  value={editFeatureForm.iconColor}
                  onChange={(e) => setEditFeatureForm({ ...editFeatureForm, iconColor: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {availableColors.map(color => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Заглавие
                </label>
                <input
                  type="text"
                  value={editFeatureForm.title}
                  onChange={(e) => setEditFeatureForm({ ...editFeatureForm, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  value={editFeatureForm.description}
                  onChange={(e) => setEditFeatureForm({ ...editFeatureForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setEditingFeature(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отказ
                </button>
                <button
                  onClick={() => handleSaveFeature(editingFeature, editFeatureForm)}
                  disabled={isSaving}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  Запази
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomepageEditor;