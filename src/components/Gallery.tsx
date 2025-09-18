import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Loader2 } from 'lucide-react';

interface LocationSettings {
  googleMapsUrl: string;
  title: string;
  description: string;
}

const defaultSettings: LocationSettings = {
  googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2909.123456789!2d28.123456!3d43.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDA3JzI0LjQiTiAyOMKwMDcnMjQuNCJF!5e0!3m2!1sen!2sbg!4v1234567890123!5m2!1sen!2sbg',
  title: 'Локация',
  description: 'Стратегическо местоположение с отлична достъпност до ключови точки в града'
};

const Location = () => {
  const [settings, setSettings] = useState<LocationSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocationSettings = async () => {
      try {
        const docRef = doc(db, 'content', 'location');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as LocationSettings;
          setSettings(data);
        }
      } catch (error) {
        console.error('Error loading location settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocationSettings();
  }, []);

  return (
    <section className="py-20 bg-white" id="location">
      <div className="container-custom">
        <h2 className="section-title text-center">{settings.title}</h2>
        <p className="text-center text-neutral-600 mb-12 max-w-2xl mx-auto">
          {settings.description}
        </p>

        <div className="rounded-lg overflow-hidden shadow-lg">
          {loading ? (
            <div className="w-full h-[600px] flex items-center justify-center bg-gray-100">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <iframe
              src={settings.googleMapsUrl}
              title="Google Maps - Paradise Green Park Location"
              className="w-full h-[600px] object-cover"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Location;