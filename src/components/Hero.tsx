import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const heroImageUrl = "https://firebasestorage.googleapis.com/v0/b/paradise-fbb21.firebasestorage.app/o/media%2F1758179336080_DSC_0688.JPG?alt=media&token=81332077-bde8-432c-9b95-daae219664ac";
  
  // Optimized image URLs for different screen sizes
  const optimizedImageUrls = {
    mobile: `${heroImageUrl}&w=768&h=1024&fit=crop&auto=format,compress&q=75`,
    tablet: `${heroImageUrl}&w=1024&h=768&fit=crop&auto=format,compress&q=80`,
    desktop: `${heroImageUrl}&w=1920&h=1080&fit=crop&auto=format,compress&q=85`
  };

  return (
    <section className="relative h-screen-90">
      <div className="absolute inset-0">
        {/* Optimized responsive image with lazy loading */}
        <picture>
          <source 
            media="(max-width: 768px)" 
            srcSet={optimizedImageUrls.mobile}
          />
          <source 
            media="(max-width: 1024px)" 
            srcSet={optimizedImageUrls.tablet}
          />
          <img
            src={optimizedImageUrls.desktop}
            alt="Paradise Green Park - Луксозни апартаменти в Златни пясъци"
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            onLoad={(e) => {
              // Add fade-in effect when image loads
              e.currentTarget.style.opacity = '1';
            }}
            style={{ 
              opacity: '0', 
              transition: 'opacity 0.5s ease-in-out',
              backgroundColor: '#2d5a3d' // Fallback color matching theme
            }}
          />
        </picture>
        
        {/* Preload critical image for faster loading */}
        <link 
          rel="preload" 
          as="image" 
          href={optimizedImageUrls.desktop}
          media="(min-width: 1025px)"
        />
        <link 
          rel="preload" 
          as="image" 
          href={optimizedImageUrls.mobile}
          media="(max-width: 768px)"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container-custom text-center text-white px-4">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <h1 className="font-sans text-4xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-2xl">
            Paradise Green Park Apartments
          </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white/95 drop-shadow-lg">
            Луксозни апартаменти за продажба с изглед към морето в престижния комплекс в Златни пясъци
          </p>
            <Link
            to="/apartments"
              className="inline-flex items-center space-x-2 bg-primary text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary-dark transition duration-300 shadow-2xl hover:shadow-primary/25"
          >
            <span>Виж апартаментите</span>
            <ChevronRight size={20} />
          </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;