import React, { useState } from 'react';
import { BarChart3, Save, Plus, Trash2, GripVertical, Loader2, Pencil, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useAvailabilitySettings, StatItem, FeatureItem } from '../../lib/hooks/useAvailabilitySettings';

const availableIcons = [
  'Building2', 'Car', 'Waves', 'MapPin', 'Users', 'Star', 'Sparkles', 'Sun',
  'Home', 'Shield', 'Wifi', 'Coffee', 'TreePine', 'Utensils', 'Dumbbell',
  'Baby', 'Gamepad2', 'Music', 'Camera', 'Phone', 'Mail', 'Award', 'Gift'
];

const availableGradients = [
  { value: 'from-emerald-500 to-teal-600', label: 'Зелен към Тийл', preview: 'bg-gradient-to-r from-emerald-500 to-teal-600' },
  { value: 'from-blue-500 to-cyan-600', label: 'Син към Циан', preview: 'bg-gradient-to-r from-blue-500 to-cyan-600' },
  { value: 'from-cyan-500 to-blue-600', label: 'Циан към Син', preview: 'bg-gradient-to-r from-cyan-500 to-blue-600' },
  { value: 'from-amber-500 to-orange-600', label: 'Жълт към Оранжев', preview: 'bg-gradient-to-r from-amber-500 to-orange-600' },
  { value: 'from-purple-500 to-pink-600', label: 'Лилав към Розов', preview: 'bg-gradient-to-r from-purple-500 to-pink-600' },
  { value: 'from-yellow-500 to-orange-600', label: 'Жълт към Оранжев', preview: 'bg-gradient-to-r from-yellow-500 to-orange-600' },
  { value: 'from-indigo-500 to-purple-600', label: 'Индиго към Лилав', preview: 'bg-gradient-to-r from-indigo-500 to-purple-600' },
  { value: 'from-orange-500 to-red-600', label: 'Оранжев към Червен', preview: 'bg-gradient-to-r from-orange-500 to-red-600' }
];

const availableIconColors = [
  { value: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Зелен' },
  { value: 'text-blue-600', bg: 'bg-blue-100', label: 'Син' },
  { value: 'text-cyan-600', bg: 'bg-cyan-100', label: 'Циан' },
  { value: 'text-amber-600', bg: 'bg-amber-100', label: 'Жълт' },
  { value: 'text-purple-600', bg: 'bg-purple-100', label: 'Лилав' },
  { value: 'text-red-600', bg: 'bg-red-100', label: 'Червен' },
  { value: 'text-pink-600', bg: 'bg-pink-100', label: 'Розов' },
  { value: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Индиго' }
];

const AvailabilityEditor = () => {
  const {
    settings,
    loading,
    error,
    saveSettings,
    updateStat,
    addStat,
    removeStat,
    reorderStats,
    updateFeature,
    addFeature,
    removeFeature,
    reorderFeatures
  } = useAvailabilitySettings();

  const [activeTab, setActiveTab] = useState<'general' | 'stats' | 'features'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [editingStat, setEditingStat] = useState<string | null>(null);
  const [editingFeature, setEditingFeature] = useState<string | null>(null);
  const [draggedStat, setDraggedStat] = useState<string | null>(null);
  const [draggedFeature, setDraggedFeature] = useState<string | null>(null);

  const [generalForm, setGeneralForm] = useState({
    title: settings.title,
    subtitle: settings.subtitle,
    description: settings.description
  });

  const [statForm, setStatForm] = useState({
    icon: 'Building2',
    number: 0,
    label: '',
    description: '',
    gradient: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600'
  });

  const [featureForm, setFeatureForm] = useState({
    icon: 'Users',
    text: '',
    gradient: 'from-purple-500 to-pink-600'
  });

  React.useEffect(() => {
    if (!loading) {
      setGeneralForm({
        title: settings.title,
        subtitle: settings.subtitle,
        description: settings.description
      });
    }
  }, [settings, loading]);

  const handleSaveGeneral = async () => {
    setIsSaving(true);
    try {
      await saveSettings(generalForm);
      alert('Основните настройки са запазени успешно!');
    } catch (error) {
      alert('Грешка при запазване');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddStat = async () => {
    if (!statForm.label || !statForm.description) {
      alert('Моля, попълнете всички полета');
      return;
    }

    setIsSaving(true);
    try {
      await addStat(statForm);
      setStatForm({
        icon: 'Building2',
        number: 0,
        label: '',
        description: '',
        gradient: 'from-emerald-500 to-teal-600',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600'
      });
      alert('Статистиката е добавена успешно!');
    } catch (error) {
      alert('Грешка при добавяне');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddFeature = async () => {
    if (!featureForm.text) {
      alert('Моля, попълнете всички полета');
      return;
    }

    setIsSaving(true);
    try {
      await addFeature(featureForm);
      setFeatureForm({
        icon: 'Users',
        text: '',
        gradient: 'from-purple-500 to-pink-600'
      });
      alert('Характеристиката е добавена успешно!');
    } catch (error) {
      alert('Грешка при добавяне');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStat = async (statId: string) => {
    if (window.confirm('Сигурни ли сте, че искате да изтриете тази статистика?')) {
      setIsSaving(true);
      try {
        await removeStat(statId);
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
        await removeFeature(featureId);
      } catch (error) {
        alert('Грешка при изтриване');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleStatDragStart = (e: React.DragEvent, statId: string) => {
    setDraggedStat(statId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleStatDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleStatDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedStat || draggedStat === targetId) return;

    const stats = [...settings.stats];
    const draggedIndex = stats.findIndex(s => s.id === draggedStat);
    const targetIndex = stats.findIndex(s => s.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [draggedStatItem] = stats.splice(draggedIndex, 1);
    stats.splice(targetIndex, 0, draggedStatItem);

    setIsSaving(true);
    try {
      await reorderStats(stats);
    } catch (error) {
      alert('Грешка при преподреждане');
    } finally {
      setIsSaving(false);
      setDraggedStat(null);
    }
  };

  const handleFeatureDragStart = (e: React.DragEvent, featureId: string) => {
    setDraggedFeature(featureId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleFeatureDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedFeature || draggedFeature === targetId) return;

    const features = [...settings.features];
    const draggedIndex = features.findIndex(f => f.id === draggedFeature);
    const targetIndex = features.findIndex(f => f.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [draggedFeatureItem] = features.splice(draggedIndex, 1);
    features.splice(targetIndex, 0, draggedFeatureItem);

    setIsSaving(true);
    try {
      await reorderFeatures(features);
    } catch (error) {
      alert('Грешка при преподреждане');
    } finally {
      setIsSaving(false);
      setDraggedFeature(null);
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <BarChart3 className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-2xl font-bold">Управление на статистики</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'general'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Основни настройки
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'stats'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Статистики
        </button>
        <button
          onClick={() => setActiveTab('features')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'features'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Характеристики
        </button>
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Основни настройки</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заглавие
              </label>
              <input
                type="text"
                value={generalForm.title}
                onChange={(e) => setGeneralForm({ ...generalForm, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Подзаглавие
              </label>
              <input
                type="text"
                value={generalForm.subtitle}
                onChange={(e) => setGeneralForm({ ...generalForm, subtitle: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                value={generalForm.description}
                onChange={(e) => setGeneralForm({ ...generalForm, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveGeneral}
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

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {/* Add new stat */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Добави нова статистика</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Икона
                </label>
                <select
                  value={statForm.icon}
                  onChange={(e) => setStatForm({ ...statForm, icon: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {availableIcons.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Число
                </label>
                <input
                  type="number"
                  value={statForm.number}
                  onChange={(e) => setStatForm({ ...statForm, number: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Етикет
                </label>
                <input
                  type="text"
                  value={statForm.label}
                  onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <input
                  type="text"
                  value={statForm.description}
                  onChange={(e) => setStatForm({ ...statForm, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <button
              onClick={handleAddStat}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors disabled:opacity-50"
            >
              <Plus className="w-5 h-5 mr-2" />
              Добави статистика
            </button>
          </div>

          {/* Existing stats */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Съществуващи статистики</h2>
            
            <div className="space-y-4">
              {settings.stats
                .sort((a, b) => a.order - b.order)
                .map((stat) => (
                <div
                  key={stat.id}
                  draggable
                  onDragStart={(e) => handleStatDragStart(e, stat.id)}
                  onDragOver={handleStatDragOver}
                  onDrop={(e) => handleStatDrop(e, stat.id)}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-move"
                >
                  <div className="flex items-center space-x-4">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                      {React.createElement((LucideIcons as any)[stat.icon] || LucideIcons.Building2, { 
                        className: `w-6 h-6 ${stat.iconColor}` 
                      })}
                    </div>
                    <div>
                      <div className="font-medium">{stat.number} {stat.label}</div>
                      <div className="text-sm text-gray-500">{stat.description}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDeleteStat(stat.id)}
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

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div className="space-y-6">
          {/* Add new feature */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Добави нова характеристика</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Икона
                </label>
                <select
                  value={featureForm.icon}
                  onChange={(e) => setFeatureForm({ ...featureForm, icon: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {availableIcons.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Текст
                </label>
                <input
                  type="text"
                  value={featureForm.text}
                  onChange={(e) => setFeatureForm({ ...featureForm, text: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Градиент
                </label>
                <select
                  value={featureForm.gradient}
                  onChange={(e) => setFeatureForm({ ...featureForm, gradient: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {availableGradients.map(gradient => (
                    <option key={gradient.value} value={gradient.value}>
                      {gradient.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleAddFeature}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors disabled:opacity-50"
            >
              <Plus className="w-5 h-5 mr-2" />
              Добави характеристика
            </button>
          </div>

          {/* Existing features */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Съществуващи характеристики</h2>
            
            <div className="space-y-4">
              {settings.features
                .sort((a, b) => a.order - b.order)
                .map((feature) => (
                <div
                  key={feature.id}
                  draggable
                  onDragStart={(e) => handleFeatureDragStart(e, feature.id)}
                  onDragOver={handleStatDragOver}
                  onDrop={(e) => handleFeatureDrop(e, feature.id)}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-move"
                >
                  <div className="flex items-center space-x-4">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center`}>
                      {React.createElement((LucideIcons as any)[feature.icon] || LucideIcons.Users, { 
                        className: "w-6 h-6 text-white" 
                      })}
                    </div>
                    <div>
                      <div className="font-medium">{feature.text}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDeleteFeature(feature.id)}
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
    </div>
  );
};

export default AvailabilityEditor;