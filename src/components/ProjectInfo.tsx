import React from 'react';
import { Building2, Map, Car, Waves, TreePine, Utensils, Wifi, Shield } from 'lucide-react';

const ProjectInfo = () => {
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
            <span className="text-primary">Луксозен живот</span>
            <span className="block text-secondary mt-2">край морето</span>
          </h2>
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-1 bg-primary rounded-full"></div>
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <div className="w-16 h-1 bg-primary rounded-full"></div>
          </div>
          <p className="text-xl text-neutral-600 max-w-4xl mx-auto leading-relaxed">
            Paradise Green Park предлага уникално съчетание от модерен комфорт, 
            природна красота и морско спокойствие в сърцето на Златни пясъци
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
            <div className="relative">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/paradise-fbb21.firebasestorage.app/o/media%2F1758179336080_DSC_0688.JPG?alt=media&token=81332077-bde8-432c-9b95-daae219664ac"
                alt="Paradise Green Park изглед"
                className="w-full h-[600px] object-cover"
              />
            </div>
          </div>
          
          {/* Floating cards */}
          <div className="absolute -top-8 -left-8 bg-white rounded-xl p-4 shadow-lg hidden lg:block">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <TreePine className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-neutral-800">Еко-френдли</div>
                <div className="text-sm text-neutral-600">Зелена енергия</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default ProjectInfo;