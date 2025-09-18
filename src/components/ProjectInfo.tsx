import React from 'react';
import { useState, useEffect } from 'react';
import { Building2, Map, Car, Waves, TreePine, Utensils, Wifi, Shield } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useHomepageContent } from '../lib/hooks/useHomepageContent';

const ProjectInfo = () => {
  const { content, loading: contentLoading } = useHomepageContent();
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const q = query(collection(db, 'media'), where('type', '==', 'image'));
        const querySnapshot = await getDocs(q);
        const images = querySnapshot.docs.map(doc => doc.data().url);
        
        if (images.length > 0) {
          setGalleryImages(images);
        } else {
          // Fallback to default image if no gallery images
          setGalleryImages([
            'https://firebasestorage.googleapis.com/v0/b/paradise-fbb21.firebasestorage.app/o/media%2F1758179336080_DSC_0688.JPG?alt=media&token=81332077-bde8-432c-9b95-daae219664ac'
          ]);
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        // Fallback to default image on error
        setGalleryImages([
          'https://firebasestorage.googleapis.com/v0/b/paradise-fbb21.firebasestorage.app/o/media%2F1758179336080_DSC_0688.JPG?alt=media&token=81332077-bde8-432c-9b95-daae219664ac'
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
  };
  const features = [
    {
      icon: <Building2 className="w-8 h-8 text-primary" />,
      title: 'Архитектура',
      description: 'Модерна архитектура с панорамни прозорци и просторни тераси с изглед към морето'
    },
    {
      icon: <Waves className="w-8 h-8 text-blue-500" />,
      title: 'Басейн & СПА',
      description: 'Външен басейн с морска вода, джакузи и пълноценен СПА център за релакс'
    },
    {
      icon: <TreePine className="w-8 h-8 text-green-500" />,
      title: 'Градини',
      description: 'Ландшафтни градини с тропически растения и зони за отдих сред природата'
    },
    {
      icon: <Utensils className="w-8 h-8 text-amber-500" />,
      title: 'Ресторант',
      description: 'Изискан ресторант с международна кухня и специалитети от морски дарове'
    },
    {
      icon: <Shield className="w-8 h-8 text-red-500" />,
      title: 'Сигурност',
      description: 'Денонощна охрана, контролиран достъп и видеонаблюдение в целия комплекс'
    },
    {
      icon: <Wifi className="w-8 h-8 text-purple-500" />,
      title: 'Удобства',
      description: 'Безплатен WiFi, фитнес зала, детска площадка и бизнес център'
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-100 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-primary">{contentLoading ? 'Зареждане...' : content.projectInfo.title}</span>
            <span className="block text-secondary mt-2">{contentLoading ? '' : content.projectInfo.subtitle}</span>
          </h2>
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-1 bg-primary rounded-full"></div>
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <div className="w-16 h-1 bg-primary rounded-full"></div>
          </div>
          <p className="text-xl text-neutral-600 max-w-4xl mx-auto leading-relaxed">
            {contentLoading ? 'Зареждане на описанието...' : content.projectInfo.description}
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-neutral-100 hover:border-primary/20"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-br from-neutral-50 to-neutral-100 group-hover:from-primary/10 group-hover:to-secondary/10 transition-all duration-300">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hero image section */}
        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <div className="relative group">
              {isLoading ? (
                <div className="w-full h-[600px] bg-gray-200 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <img
                    src={galleryImages[currentImageIndex]}
                    alt={`Paradise Green Park изглед ${currentImageIndex + 1}`}
                    className="w-full h-[600px] object-cover transition-opacity duration-500"
                  />
                  
                  {galleryImages.length > 1 && (
                    <>
                      {/* Navigation arrows */}
                      <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                        aria-label="Предишна снимка"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      
                      <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                        aria-label="Следваща снимка"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      
                      {/* Dots indicator */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {galleryImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              index === currentImageIndex
                                ? 'bg-white scale-110'
                                : 'bg-white/50 hover:bg-white/75'
                            } z-10 relative`}
                            aria-label={`Отиди на снимка ${index + 1}`}
                          />
                        ))}
                      </div>
                      
                      {/* Image counter */}
                      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {galleryImages.length}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectInfo;