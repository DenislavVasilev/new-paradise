import React, { useState, useEffect } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { Loader2 } from 'lucide-react';

const Location = () => {
  const [locationImageUrl, setLocationImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocationImage = async () => {
      try {
        const imageRef = ref(storage, 'media/1748256397199_situaciq.jpg');
        const url = await getDownloadURL(imageRef);
        setLocationImageUrl(url);
      } catch (error) {
        console.error('Error loading location image:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocationImage();
  }, []);

  return (
    <section className="py-20 bg-white" id="location">
      <div className="container-custom">
        <h2 className="section-title text-center">Локация</h2>
        <p className="text-center text-neutral-600 mb-12 max-w-2xl mx-auto">
          Стратегическо местоположение с отлична достъпност до ключови точки в града
        </p>

        <div className="rounded-lg overflow-hidden shadow-lg">
          {loading ? (
            <div className="w-full h-[600px] flex items-center justify-center bg-gray-100">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <img
              src={locationImageUrl}
              alt="Карта на местоположението"
              className="w-full h-[600px] object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Location;