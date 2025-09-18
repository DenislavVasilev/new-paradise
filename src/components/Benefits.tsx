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
      icon: <Shield className="w-12 h-12 text-accent" />,
      title: 'Сигурност',
      description: 'Модерни общи части и контрол на достъпа'
    },
    {
      icon: <MapPin className="w-12 h-12 text-accent" />,
      title: 'Комуникативност',
      description: 'Близост до градски транспорт и удобства'
    },
    {
      icon: <Zap className="w-12 h-12 text-accent" />,
      title: 'Енергийна ефективност',
      description: 'Клас А енергийна ефективност и умни системи'
    },
    {
      icon: <Home className="w-12 h-12 text-accent" />,
      title: 'Качество',
      description: 'Първокласни материали и изпълнение'
    }
  ];

  return (
    <section className="py-20 bg-white" id="benefits">
      <div className="container-custom">
        <h2 className="section-title text-center">
          Защо да изберете сграда Molino?
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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent bg-opacity-10 mb-4">
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