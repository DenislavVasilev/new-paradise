import React from 'react';
import { Building2, Map, Car } from 'lucide-react';

const ProjectInfo = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="mb-20">
          <h2 className="section-title text-center">Модерна архитектура и уникален стил</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <div className="bg-neutral-50 rounded-lg p-8">
            <Building2 className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-4">Обект</h3>
            <p className="text-neutral-600">
    Обектът представлява единадесететажна сграда, състояща се от два входа, където се помещават апартаменти и търговски площи. Сградата изпълнява най-високите изисквания за качество и модерна архитектура.
            </p>
          </div>

          <div className="bg-neutral-50 rounded-lg p-8">
            <Map className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-4">Локация</h3>
            <p className="text-neutral-600">
              Сградата се намира в близост до училища, спирки на градския транспорт, търговски центрове и ключови булеварди като Христо Смирненски и бул. Васил Левски. 
            </p>
          </div>

          <div className="bg-neutral-50 rounded-lg p-8">
            <Car className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-4">Паркиране</h3>
            <p className="text-neutral-600">
              Подсигурено е паркирането с 135 закрити паркоместа + 2 гаража. Има на разположение велостойки.
            </p>
          </div>
        </div>

        <div className="w-full">
          <div className="rounded-lg overflow-hidden">
            <img
              src="/visual.png"
              alt="Сграда изглед"
              className="w-full h-[500px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectInfo;