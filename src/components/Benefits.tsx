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
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: 'Сигурност 24/7',
      description: 'Денонощна охрана и видеонаблюдение за вашето спокойствие'
    },
    {
      icon: <Waves className="w-8 h-8 text-primary" />,
      title: 'Морски бриз',
      description: 'На 50 метра от плажа с кристално чиста вода'
    },
    {
      icon: <TreePine className="w-8 h-8 text-primary" />,
      title: 'Зелена оазис',
      description: 'Красиви градини и зелени площи за релакс'
    },
    {
      icon: <Utensils className="w-8 h-8 text-primary" />,
      title: 'Ресторант & СПА',
      description: 'Изискана кухня и релаксиращи СПА процедури'
    },
    {
      icon: <Car className="w-8 h-8 text-primary" />,
      title: 'Подземен паркинг',
      description: 'Охраняеми паркоместа за всички собственици'
    },
    {
      icon: <Home className="w-8 h-8 text-primary" />,
      title: 'Луксозни довършвания',
      description: 'Висококачествени материали и модерен дизайн'
    }
  ];

  return (
    <section className="py-20 bg-white" id="benefits">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Защо да изберете 
            <span className="block text-secondary mt-2">Paradise Green Park?</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Открийте перфектната комбинация от луксозен живот, природна красота и морско спокойствие
          </p>
        </div>
        
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`group bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform border border-neutral-100 hover:border-primary/20 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              } hover:-translate-y-2`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Icon container */}
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                {benefit.icon}
              </div>
              
              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-neutral-800 mb-4 group-hover:text-primary transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
              
              {/* Decorative element */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-500 rounded-full"></div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 bg-neutral-50 rounded-full px-8 py-4 border border-neutral-200">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-secondary border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-accent border-2 border-white"></div>
            </div>
            <span className="text-neutral-700 font-medium">Над 1000 щастливи собственици</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;