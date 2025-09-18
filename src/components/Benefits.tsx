import React from 'react';
import { Shield, MapPin, Zap, Home } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const Benefits = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const benefits = [
    {
      icon: <Shield className="w-12 h-12 text-primary" />,
      title: 'Сигурност',
      description: '24/7 охрана и видеонаблюдение в целия комплекс'
    },
    {
      icon: <MapPin className="w-12 h-12 text-primary" />,
      title: 'Локация',
      description: 'На 50 метра от плажа в престижния курорт Златни пясъци'
    },
    {
      icon: <Zap className="w-12 h-12 text-primary" />,
      title: 'Удобства',
      description: 'Басейн, фитнес, СПА център и ресторант в комплекса'
    },
    {
      icon: <Home className="w-12 h-12 text-primary" />,
      title: 'Качество',
      description: 'Луксозни довършителни работи и модерен дизайн'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-neutral-50" id="benefits">
      <div className="container-custom">
        <h2 className="section-title text-center">
          Защо да изберете Paradise Green Park?
        </h2>
        
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`text-center p-6 rounded-lg bg-neutral-50 shadow-sm transition-all duration-500 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary bg-opacity-10 mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-neutral-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;