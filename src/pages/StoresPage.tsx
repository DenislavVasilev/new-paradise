import React from 'react';
import { useStores } from '../lib/hooks/useStores';
import { Loader2 } from 'lucide-react';

const StoresPage = () => {
  const { stores, loading, error } = useStores();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-neutral-50">
      <div className="container-custom">
        <h1 className="text-4xl font-bold text-center mb-12">Търговски обекти</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={store.mainImage} 
                  alt={store.title}
                  className="w-full h-auto"
                />
              </div>
              {store.secondaryImage && (
                <div className="relative">
                  <img 
                    src={store.secondaryImage} 
                    alt={`${store.title} - допълнителна снимка`}
                    className="w-full h-auto"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{store.title}</h2>
                <p className="text-neutral-600">{store.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoresPage