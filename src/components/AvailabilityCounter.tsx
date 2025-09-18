import React from 'react';
import * as LucideIcons from 'lucide-react';
import { useAvailabilitySettings } from '../lib/hooks/useAvailabilitySettings';
import { Loader2 } from 'lucide-react';

const AvailabilityCounter = () => {
  const { settings, loading } = useAvailabilitySettings();

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? IconComponent : LucideIcons.Building2;
  };

  if (loading) {
    return (
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-emerald-900">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          </div>
        </div>
        <div className="container-custom relative z-10">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-emerald-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {settings.title}
            <span className="block text-secondary mt-2">{settings.subtitle}</span>
          </h2>
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-1 bg-secondary rounded-full"></div>
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <div className="w-16 h-1 bg-secondary rounded-full"></div>
          </div>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            {settings.description}
          </p>
        </div>

        {/* Main stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {settings.stats
            .sort((a, b) => a.order - b.order)
            .map((stat, index) => {
            const IconComponent = getIconComponent(stat.icon);
            return (
            <div
              key={stat.id}
              className="group relative"
            >
              {/* Card */}
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.iconBg} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-8 h-8 ${stat.iconColor}`} />
                </div>
                
                {/* Number */}
                <div className="text-5xl font-bold text-white mb-2 group-hover:text-secondary transition-colors duration-300">
                  {stat.number}
                </div>
                
                {/* Label */}
                <div className="text-lg font-semibold text-emerald-100 mb-2">
                  {stat.label}
                </div>
                
                {/* Description */}
                <div className="text-sm text-emerald-200/80">
                  {stat.description}
                </div>

                {/* Decorative line */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-secondary group-hover:w-full transition-all duration-500 rounded-full"></div>
              </div>
            </div>
          );
          })}
        </div>

        {/* Additional features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {settings.features
            .sort((a, b) => a.order - b.order)
            .map((feature, index) => {
            const IconComponent = getIconComponent(feature.icon);
            return (
            <div
              key={feature.id}
              className="group flex items-center space-x-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-medium group-hover:text-secondary transition-colors duration-300">
                {feature.text}
              </span>
            </div>
          );
          })}
        </div>

      </div>
    </section>
  );
};

export default AvailabilityCounter;