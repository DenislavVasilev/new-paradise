import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHomepageContent } from '../lib/hooks/useHomepageContent';

const Hero = () => {
  const { content, loading } = useHomepageContent();

  if (loading) {
    return (
      <section className="relative h-screen-90">
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
      </section>
    );
  }

  return (
    <section className="relative h-screen-90">
      <div className="absolute inset-0">
        <img
          src={content.hero.backgroundImage}
          alt="Paradise Green Park"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container-custom text-center text-white px-4">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <h1 className="font-sans text-4xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-2xl">
              {content.hero.title}
          </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white/95 drop-shadow-lg">
              {content.hero.subtitle}
          </p>
            <Link
            to="/apartments"
              className="inline-flex items-center space-x-2 bg-primary text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary-dark transition duration-300 shadow-2xl hover:shadow-primary/25"
          >
              <span>{content.hero.buttonText}</span>
            <ChevronRight size={20} />
          </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;