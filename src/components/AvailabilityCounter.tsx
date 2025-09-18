import React, { useState, useEffect } from 'react';
import { Building2, CarFront, Bike, Store } from 'lucide-react';

const AvailabilityCounter = () => {
  const [stats, setStats] = useState({
    Apartments: 85,
    ParkingSpaces: 95,
    poolArea: 250,
    beachDistance: 50
  });

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6">
            <div className="flex justify-center items-center mb-4">
              <Building2 className="w-8 h-8 text-secondary" />
            </div>
            <div className="text-4xl font-bold mb-2">{stats.Apartments}</div>
            <div className="text-sm text-neutral-300">Апартамента</div>
          </div>
          
          <div className="text-center p-6">
            <div className="flex justify-center items-center mb-4">
              <CarFront className="w-8 h-8 text-secondary" />
            </div>
            <div className="text-4xl font-bold mb-2">{stats.ParkingSpaces}</div>
            <div className="text-sm text-neutral-300">Паркоместа</div>
          </div>
          
          <div className="text-center p-6">
            <div className="flex justify-center items-center mb-4">
              <Bike className="w-8 h-8 text-secondary" />
            </div>
            <div className="text-4xl font-bold mb-2">{stats.poolArea}</div>
            <div className="text-sm text-neutral-300">кв.м басейн</div>
          </div>
          
          <div className="text-center p-6">
            <div className="flex justify-center items-center mb-4">
              <Store className="w-8 h-8 text-secondary" />
            </div>
            <div className="text-4xl font-bold mb-2">{stats.beachDistance}</div>
            <div className="text-sm text-neutral-300">метра до плажа</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvailabilityCounter;