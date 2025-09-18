import React, { useState } from 'react';
import { Save, Settings as SettingsIcon, Loader2, CheckCircle } from 'lucide-react';
import { useSettings } from '../../lib/hooks/useSettings';

const Settings = () => {
  const { settings, loading, error, saveSettings } = useSettings();
  const [formData, setFormData] = useState({
    companyName: settings.companyName,
    email: settings.email,
    phone: settings.phone,
    address: settings.address,
    socialMedia: {
      facebook: settings.socialMedia.facebook,
      instagram: settings.socialMedia.instagram
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  React.useEffect(() => {
    if (!loading) {
      setFormData({
        companyName: settings.companyName,
        email: settings.email,
        phone: settings.phone,
        address: settings.address,
        socialMedia: {
          facebook: settings.socialMedia.facebook,
          instagram: settings.socialMedia.instagram
        }
      });
    }
  }, [settings, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus({ type: null, message: '' });

    try {
      const success = await saveSettings(formData);
      if (success) {
        setSaveStatus({
          type: 'success',
          message: 'Настройките са запазени успешно!'
        });
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveStatus({ type: null, message: '' });
        }, 3000);
      } else {
        setSaveStatus({
          type: 'error',
          message: 'Грешка при запазване на настройките'
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus({
        type: 'error',
        message: 'Възникна неочаквана грешка'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
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
          <SettingsIcon className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-2xl font-bold">Настройки</h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Запазване...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Запази промените
            </>
          )}
        </button>
      </div>

      {saveStatus.type && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            saveStatus.type === 'success'
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <div className="flex items-center">
            {saveStatus.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <SettingsIcon className="w-5 h-5 mr-2" />
            )}
            <span>{saveStatus.message}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-6 text-gray-800 border-b border-gray-200 pb-2">
              Информация за компанията
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Име на компанията *
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Paradise Green Park"
                  required
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Имейл адрес *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="office@paradise-greenpark.bg"
                  required
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Телефонен номер *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="0889 66 00 00"
                  required
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Адрес *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Златни пясъци, 9007 Варна, България"
                  required
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-6 text-gray-800 border-b border-gray-200 pb-2">
              Социални мрежи
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={formData.socialMedia.facebook}
                  onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="https://facebook.com/paradise-greenpark"
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={formData.socialMedia.instagram}
                  onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="https://instagram.com/paradise-greenpark"
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Запазване...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Запази промените
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Информация:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Промените ще се отразят автоматично в публичната част на сайта</li>
          <li>• Контактната информация се използва в Header и Footer</li>
          <li>• Социалните мрежи се показват в Footer-а</li>
          <li>• Всички полета с * са задължителни</li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;