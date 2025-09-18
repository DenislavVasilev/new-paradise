import React from 'react';
import { Shield, Waves, TreePine, Utensils, Car, Home, Wifi, Dumbbell, Baby, Users, Coffee, Gamepad2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const Benefits = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const benefits = [
    {
      icon: <Waves className="w-8 h-8 text-primary" />,
      title: 'Басейн с морска вода',
      description: 'Открит басейн с подгрявана морска вода и детска секция'
    },
    {
      icon: <Utensils className="w-8 h-8 text-primary" />,
      title: 'Ресторант & Бар',
      description: 'Изискан ресторант с международна кухня и коктейл бар'
    },
    {
      icon: <TreePine className="w-8 h-8 text-primary" />,
      title: 'СПА & Уелнес център',
      description: 'Пълноценен СПА център с масажи и релаксиращи процедури'
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: 'Сигурност 24/7',
      description: 'Денонощна охрана, видеонаблюдение и контролиран достъп'
    },
    {
      icon: <Car className="w-8 h-8 text-primary" />,
      title: 'Подземен паркинг',
      description: 'Охраняеми паркоместа в подземен гараж за всички собственици'
    },
    {
      icon: <Dumbbell className="w-8 h-8 text-primary" />,
      title: 'Фитнес център',
      description: 'Модерна фитнес зала с професионално оборудване'
    },
    {
      icon: <Baby className="w-8 h-8 text-primary" />,
      title: 'Детска площадка',
      description: 'Безопасна и забавна детска зона с модерни съоръжения'
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: 'Консиерж услуги',
      description: 'Професионални консиерж услуги за максимален комфорт'
    },
    {
      icon: <Coffee className="w-8 h-8 text-primary" />,
      title: 'Лоби бар',
      description: 'Елегантен лоби бар за срещи и бизнес разговори'
    },
    {
      icon: <Wifi className="w-8 h-8 text-primary" />,
      title: 'Безплатен WiFi',
      description: 'Високоскоростен интернет в целия комплекс'
    },
    {
      icon: <Home className="w-8 h-8 text-primary" />,
      title: 'Луксозни довършвания',
      description: 'Висококачествени материали и модерен дизайн във всеки апартамент'
    },
    {
      icon: <Gamepad2 className="w-8 h-8 text-primary" />,
      title: 'Развлекателна зона',
      description: 'Игрална зона и места за отдих и социализиране'
    }
  ];

  return (
    <section className="py-20 bg-white" id="benefits">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Удобства и услуги в 
            <span className="block text-secondary mt-2">Paradise Green Park</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Открийте пълната гама от луксозни удобства и професионални услуги в нашия престижен морски комплекс
          </p>
        </div>
        
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform border border-neutral-100 hover:border-primary/20 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              } hover:-translate-y-2`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon container */}
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors duration-300 mx-auto">
                {benefit.icon}
              </div>
              
              {/* Content */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-neutral-800 mb-3 group-hover:text-primary transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed text-sm">
                  {benefit.description}
                </p>
              </div>
              
              {/* Decorative element */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-500 rounded-full"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Benefits;