import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative h-screen-90">
      <div className="absolute inset-0">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/paradise-fbb21.firebasestorage.app/o/media%2F1758179336080_DSC_0688.JPG?alt=media&token=81332077-bde8-432c-9b95-daae219664ac"
          alt="Paradise Green Park"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container-custom text-center text-white">
          <h1 className="font-sans text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Paradise Green Park Apartments
          </h1>
          <h2 className="text-xl md:text-2xl font-light mb-2 text-secondary">
            Вашият дом край морето
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Луксозни апартаменти за продажба с изглед към морето в престижния комплекс в Златни пясъци
          </p>
          <Link
            to="/apartments"
            className="inline-flex items-center space-x-2 bg-primary text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary-dark transition duration-300 shadow-lg"
          >
            <span>Виж апартаментите</span>
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;