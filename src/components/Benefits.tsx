import React from 'react';
import * as LucideIcons from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useHomepageContent } from '../lib/hooks/useHomepageContent';

const Benefits = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const { content, loading } = useHomepageContent();

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="w-8 h-8 text-primary" /> : <LucideIcons.Star className="w-8 h-8 text-primary" />;
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-6"></div>
                <div className="h-4 bg-gray-300 rounded mb-3"></div>
                <div className="h-3 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
          className={`grid gap-8 ${
            content.benefits.length <= 3 
              ? 'grid-cols-1 md:grid-cols-3' 
              : content.benefits.length <= 6
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}
        >
          {content.benefits
            .sort((a, b) => a.order - b.order)
            .map((benefit, index) => (
            <div
              key={index}
              className={`group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform border border-neutral-100 hover:border-primary/20 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              } hover:-translate-y-2`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon container */}
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors duration-300 mx-auto">
                {getIconComponent(benefit.icon)}
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