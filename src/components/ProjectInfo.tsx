import React from 'react';
import { Building2, Map, Car } from 'lucide-react';

const ProjectInfo = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="mb-20">
          <h2 className="section-title text-center">Луксозен живот край морето</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <Building2 className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-4">Комплекс</h3>
            <p className="text-neutral-600">
              Paradise Green Park е луксозен апартаментен комплекс с басейн, СПА център и ресторант. Всички апартаменти са с изглед към морето или парка.
            </p>
          </div>

          <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <Map className="w-12 h-12 text-secondary mb-4" />
            <h3 className="text-xl font-semibold mb-4">Локация</h3>
            <p className="text-neutral-600">
              Разположен в сърцето на Златни пясъци, на само 50 метра от плажа. Близо до ресторанти, барове и всички курортни удобства.
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-secondary/10 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <Car className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-4">Паркиране</h3>
            <p className="text-neutral-600">
              Подземен паркинг с охраняеми паркоместа за всички собственици. Допълнителни места за гости.
            </p>
          </div>
        </div>

        <div className="w-full">
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/paradise-fbb21.firebasestorage.app/o/media%2F1758179336080_DSC_0688.JPG?alt=media&token=81332077-bde8-432c-9b95-daae219664ac"
              alt="Paradise Green Park изглед"
              className="w-full h-[500px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectInfo;