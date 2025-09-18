import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Square, Euro, MapPin, Building2, Loader2, X, ChevronLeft, ChevronRight, Compass, Printer } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ContactForm from '../components/ContactForm';

interface Apartment {
  id: string;
  number: string;
  floor: number;
  entrance: string;
  rooms: number;
  area: number;
  netArea?: number;
  price: number;
  status: 'available' | 'reserved' | 'sold';
  description: string;
  features: string[];
  images: string[];
  mainImage?: string;
  hasTerrace: boolean;
  exposure: string;
  brochureUrl?: string;
}

const defaultImages = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80'
];

const ApartmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchApartment = async () => {
      if (!id) return;
      
      try {
        const docRef = doc(db, 'apartments', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setApartment({ id: docSnap.id, ...docSnap.data() } as Apartment);
        }
      } catch (error) {
        console.error('Error fetching apartment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApartment();
  }, [id]);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setShowLightbox(true);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!showLightbox) return;

    if (e.key === 'Escape') {
      setShowLightbox(false);
    } else if (e.key === 'ArrowLeft') {
      setCurrentImageIndex((prev) => 
        prev === 0 ? displayImages.length - 1 : prev - 1
      );
    } else if (e.key === 'ArrowRight') {
      setCurrentImageIndex((prev) => 
        prev === displayImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-800">Апартаментът не е намерен</h2>
          <button
            onClick={() => navigate('/apartments')}
            className="mt-4 inline-flex items-center text-primary hover:text-primary-dark"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Обратно към списъка
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: Apartment['status']) => {
    switch (status) {
      case 'available':
        return 'bg-accent text-white';
      case 'reserved':
        return 'bg-orange-500 text-white';
      case 'sold':
        return 'bg-red-500 text-white';
      default:
        return 'bg-neutral-200 text-neutral-700';
    }
  };

  const getStatusText = (status: Apartment['status']) => {
    switch (status) {
      case 'available':
        return 'Свободен';
      case 'reserved':
        return 'Резервиран';
      case 'sold':
        return 'Продаден';
      default:
        return '';
    }
  };

  const getEntranceLabel = (entrance: string) => {
    return entrance === '1' ? 'А' : entrance === '2' ? 'Б' : entrance;
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
      default: return exposure;
    }
  };

  const displayImages = apartment.images?.length > 0 ? apartment.images : defaultImages;
  const mainImage = apartment.mainImage || displayImages[0];
  const additionalImages = displayImages.filter(img => img !== mainImage).slice(0, 2);

  return (
    <>
      <div className="pt-24 pb-16 bg-neutral-50">
        <div className="container-custom">
          <button
            onClick={() => navigate('/apartments')}
            className="inline-flex items-center text-primary hover:text-primary-dark mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Обратно към списъка
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div>
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="relative cursor-pointer" onClick={() => handleImageClick(0)}>
                  <img
                    src={mainImage}
                    alt={`Апартамент ${apartment.number}`}
                    className="w-full h-auto"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {additionalImages.map((image, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                    <div 
                      className="relative cursor-pointer" 
                      onClick={() => handleImageClick(index + 1)}
                    >
                      <img
                        src={image}
                        alt={`Апартамент ${apartment.number} - изглед ${index + 2}`}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg p-8 shadow-md">
                <div className="flex justify-between items-start mb-6">
                  <h1 className="text-3xl font-bold">Апартамент {apartment.number}</h1>
                  <div className="flex items-center gap-2">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(apartment.status)}`}>
                      {getStatusText(apartment.status)}
                    </span>
                    {apartment.brochureUrl && (
                      <a
                        href={apartment.brochureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-primary hover:text-primary-dark transition-colors"
                        title="Принтирай брошура"
                      >
                        <Printer className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 text-accent mr-2" />
                    <div>
                      <p className="text-sm text-neutral-600">Етаж</p>
                      <p className="font-semibold">{apartment.floor}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-accent mr-2" />
                    <div>
                      <p className="text-sm text-neutral-600">Вход</p>
                      <p className="font-semibold">{getEntranceLabel(apartment.entrance)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Home className="w-5 h-5 text-accent mr-2" />
                    <div>
                      <p className="text-sm text-neutral-600">Стаи</p>
                      <p className="font-semibold">{apartment.rooms}</p>
                    </div>
                  </div>
                  {apartment.netArea && (
                    <div className="flex items-center">
                      <Square className="w-5 h-5 text-accent mr-2" />
                      <div>
                        <p className="text-sm text-neutral-600">Чиста площ</p>
                        <p className="font-semibold">{apartment.netArea} м²</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Square className="w-5 h-5 text-accent mr-2" />
                    <div>
                      <p className="text-sm text-neutral-600">Обща площ</p>
                      <p className="font-semibold">{apartment.area} м²</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Compass className="w-5 h-5 text-accent mr-2" />
                    <div>
                      <p className="text-sm text-neutral-600">Изложение</p>
                      <p className="font-semibold">{getExposureText(apartment.exposure)}</p>
                    </div>
                  </div>
                </div>

                {apartment.description && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 font-sans">Описание</h2>
                    <p className="text-neutral-600">{apartment.description}</p>
                  </div>
                )}

                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 font-sans">Характеристики</h2>
                  <ul className="grid grid-cols-2 gap-3">
                    <li className="flex items-center text-neutral-600">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      Тераса: {apartment.hasTerrace ? 'Да' : 'Не'}
                    </li>
                    {apartment.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-neutral-600">
                        <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {apartment.price > 0 && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600">Цена</p>
                      <div className="flex items-center">
                        <Euro className="w-6 h-6 text-accent mr-2" />
                        <span className="text-3xl font-bold">€{apartment.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <button
                      className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition duration-300"
                      disabled={apartment.status === 'sold'}
                      onClick={() => {
                        const contactForm = document.getElementById('contact-form');
                        if (contactForm) {
                          contactForm.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      Свържете се с нас
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div id="contact-form">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-8">
                  Интересувате се от Апартамент {apartment.number}?
                </h2>
                <ContactForm apartmentNumber={apartment.number} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {showLightbox && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setShowLightbox(false)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setShowLightbox(false)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            onClick={handlePrevImage}
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          <img
            src={displayImages[currentImageIndex]}
            alt={`Апартамент ${apartment.number} - изглед ${currentImageIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />

          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            onClick={handleNextImage}
          >
            <ChevronRight className="w-12 h-12" />
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
            {currentImageIndex + 1} / {displayImages.length}
          </div>
        </div>
      )}
    </>
  );
};

export default ApartmentDetailsPage;