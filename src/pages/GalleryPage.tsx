import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
  alt: string;
}

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample gallery images - replace with actual Firebase data
  const galleryImages: GalleryImage[] = [
    {
      id: '1',
      url: 'https://firebasestorage.googleapis.com/v0/b/paradise-fbb21.firebasestorage.app/o/media%2F1758179336080_DSC_0688.JPG?alt=media&token=81332077-bde8-432c-9b95-daae219664ac',
      title: 'Изглед към морето',
      category: 'sea-view',
      alt: 'Панорамна гледка към морето от Paradise Green Park'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      title: 'Луксозен апартамент',
      category: 'apartments',
      alt: 'Интериор на луксозен апартамент'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80',
      title: 'Басейн',
      category: 'pool',
      alt: 'Открит басейн в комплекса'
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      title: 'Всекидневна',
      category: 'apartments',
      alt: 'Модерна всекидневна с изглед към морето'
    },
    {
      id: '5',
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      title: 'Спалня',
      category: 'apartments',
      alt: 'Елегантна спалня с морска гледка'
    },
    {
      id: '6',
      url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      title: 'Лоби',
      category: 'common-areas',
      alt: 'Луксозно лоби на комплекса'
    },
    {
      id: '7',
      url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
      title: 'Ресторант',
      category: 'common-areas',
      alt: 'Ресторант в комплекса'
    },
    {
      id: '8',
      url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
      title: 'Плаж',
      category: 'surroundings',
      alt: 'Плажът в Златни пясъци'
    }
  ];

  const categories = [
    { id: 'all', name: 'Всички', count: galleryImages.length },
    { id: 'apartments', name: 'Апартаменти', count: galleryImages.filter(img => img.category === 'apartments').length },
    { id: 'common-areas', name: 'Общи части', count: galleryImages.filter(img => img.category === 'common-areas').length },
    { id: 'pool', name: 'Басейн', count: galleryImages.filter(img => img.category === 'pool').length },
    { id: 'sea-view', name: 'Изглед към морето', count: galleryImages.filter(img => img.category === 'sea-view').length },
    { id: 'surroundings', name: 'Околност', count: galleryImages.filter(img => img.category === 'surroundings').length }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    setCurrentIndex(filteredImages.findIndex(img => img.id === image.id));
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  const goToNext = () => {
    const newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentIndex]);

  return (
    <>
      <div className="pt-24 pb-16 bg-gradient-to-b from-white to-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Галерия
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Разгледайте красотата на Paradise Green Park - луксозния комплекс край морето
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-neutral-700 hover:bg-primary hover:text-white shadow-md'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => openLightbox(image)}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-500 text-lg">Няма снимки в тази категория.</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-neutral-300 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-neutral-300 transition-colors z-10"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-neutral-300 transition-colors z-10"
          >
            <ChevronRight className="w-12 h-12" />
          </button>

          <div className="max-w-4xl max-h-[90vh] mx-4">
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain"
            />
            <div className="text-center mt-4">
              <h3 className="text-white text-xl font-semibold">{selectedImage.title}</h3>
              <p className="text-neutral-300 mt-2">
                {currentIndex + 1} от {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryPage;