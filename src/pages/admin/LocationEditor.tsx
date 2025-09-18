import React, { useState } from 'react';
import { MapPin, Save, Loader2, ExternalLink } from 'lucide-react';
import { useLocationSettings } from '../../lib/hooks/useLocationSettings';

const LocationEditor = () => {
  const { settings, loading, error, saveSettings } = useLocationSettings();
  const [formData, setFormData] = useState({
    title: settings.title,
    description: settings.description,
    googleMapsUrl: settings.googleMapsUrl
  });
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (!loading) {
      setFormData({
        title: settings.title,
        description: settings.description,
        googleMapsUrl: settings.googleMapsUrl
      });
    }
  }, [settings, loading]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSettings(formData);
      alert('Настройките за локация са запазени успешно!');
    } catch (error) {
      alert('Грешка при запазване');
    } finally {
      setIsSaving(false);
    }
  };

  const extractMapUrl = (input: string): string => {
    // If it's already an embed URL, return as is
    if (input.includes('maps/embed')) {
      return input;
    }
    
    // Try to extract from Google Maps share URL
    const shareMatch = input.match(/maps\/place\/[^/]+\/@([^/]+)/);
    if (shareMatch) {
      const coords = shareMatch[1].split(',');
      if (coords.length >= 2) {
        const lat = coords[0];
        const lng = coords[1];
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2909.123456789!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${lat}N%20${lng}E!5e0!3m2!1sen!2sbg!4v1234567890123!5m2!1sen!2sbg`;
      }
    }
    
    return input;
  };

  const handleUrlChange = (value: string) => {
    const processedUrl = extractMapUrl(value);
    setFormData(prev => ({ ...prev, googleMapsUrl: processedUrl }));
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
          <MapPin className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-2xl font-bold">Управление на локация</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заглавие на секцията
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Локация"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Описание на локацията..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Maps URL
            </label>
            <div className="space-y-2">
              <textarea
                value={formData.googleMapsUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-mono text-sm"
                placeholder="Поставете Google Maps embed URL или споделен линк..."
              />
              <div className="text-sm text-gray-500">
                <p className="mb-2">Как да получите Google Maps URL:</p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Отидете на <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Maps</a></li>
                  <li>Намерете желаната локация</li>
                  <li>Кликнете "Споделяне" → "Вграждане на карта"</li>
                  <li>Копирайте HTML кода и поставете тук само src URL-а</li>
                </ol>
              </div>
            </div>
          </div>

          {formData.googleMapsUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Предварителен преглед
              </label>
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  src={formData.googleMapsUrl}
                  title="Google Maps Preview"
                  className="w-full h-64"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleSave}
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

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Информация:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Google Maps картата ще се покаже на началната страница в секция "Локация"</li>
          <li>• Можете да използвате както embed URL, така и споделен линк от Google Maps</li>
          <li>• Картата поддържа пълноекранен режим и навигация</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationEditor;