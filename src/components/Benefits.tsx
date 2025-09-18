import React from 'react';
import { Shield, MapPin, Zap, Home, Waves, TreePine, Car, Utensils } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const Benefits = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const benefits = [
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      title: 'Сигурност 24/7',
      description: 'Денонощна охрана и видеонаблюдение за вашето спокойствие',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: <Waves className="w-8 h-8 text-white" />,
      title: 'Морски бриз',
      description: 'На 50 метра от плажа с кристално чиста вода',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <TreePine className="w-8 h-8 text-white" />,
      title: 'Зелена оазис',
      description: 'Красиви градини и зелени площи за релакс',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Utensils className="w-8 h-8 text-white" />,
      title: 'Ресторант & СПА',
      description: 'Изискана кухня и релаксиращи СПА процедури',
      color: 'from-amber-500 to-amber-600'
    },
    {
      icon: <Car className="w-8 h-8 text-white" />,
      title: 'Подземен паркинг',
      description: 'Охраняеми паркоместа за всички собственици',
      color: 'from-slate-500 to-slate-600'
    },
    {
      icon: <Home className="w-8 h-8 text-white" />,
      title: 'Луксозни довършвания',
      description: 'Висококачествени материали и модерен дизайн',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-neutral-50 via-white to-green-50" id="benefits">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Защо да изберете 
            <span className="block text-secondary mt-2">Paradise Green Park?</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Открийте перфектната комбинация от луксозен живот, природна красота и морски спокойствие
          </p>
        </div>
        
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              } hover:-translate-y-2`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              {/* Icon container */}
              <div className={`relative p-6 bg-gradient-to-br ${benefit.color} text-center`}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{benefit.title}</h3>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <p className="text-neutral-600 leading-relaxed">{benefit.description}</p>
              </div>
              
              {/* Decorative element */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-8 py-4 shadow-lg">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-500"></div>
              <div className="w-8 h-8 rounded-full bg-blue-500"></div>
              <div className="w-8 h-8 rounded-full bg-amber-500"></div>
            </div>
            <span className="text-neutral-700 font-medium">Над 1000 щастливи собственици</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;