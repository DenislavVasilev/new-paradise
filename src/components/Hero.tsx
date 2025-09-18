import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative h-screen-90">
      <div className="absolute inset-0">
        <img
          src="/melnica.jpg"
          alt="Сграда Molino"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container-custom text-center text-white">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
            Модерна жилищна сграда
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Съвременна архитектура и уникален стил в град Варна
          </p>
          <Link
            to="/apartments"
            className="inline-flex items-center space-x-2 bg-accent text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-accent-dark transition duration-300"
          >
            <span>Разгледайте апартаментите</span>
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;