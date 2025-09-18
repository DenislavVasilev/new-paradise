import React from 'react';
import { Building2, Car, Waves, MapPin, Users, Star, Sparkles, Sun } from 'lucide-react';

const AvailabilityCounter = () => {
  const stats = [
    {
      icon: Building2,
      number: 85,
      label: 'Луксозни апартамента',
      description: 'С панорамна гледка',
      gradient: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    {
      icon: Car,
      number: 95,
      label: 'Охраняеми паркоместа',
      description: 'Подземен гараж',
      gradient: 'from-blue-500 to-cyan-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: Waves,
      number: 250,
      label: 'кв.м басейнов комплекс',
      description: 'С морска вода',
      gradient: 'from-cyan-500 to-blue-600',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600'
    },
    {
      icon: MapPin,
      number: 50,
      label: 'метра до плажа',
      description: 'Златни пясъци',
      gradient: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600'
    }
  ];

  const features = [
    {
      icon: Users,
      text: '24/7 Консиерж услуги',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: Star,
      text: '5-звезден СПА център',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Sparkles,
      text: 'Премиум довършвания',
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      icon: Sun,
      text: 'Целогодишен сезон',
      gradient: 'from-orange-500 to-red-600'
    }
  ];

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
            Paradise Green Park
            <span className="block text-secondary mt-2">в цифри</span>
          </h2>
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-1 bg-secondary rounded-full"></div>
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <div className="w-16 h-1 bg-secondary rounded-full"></div>
          </div>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Открийте луксоза и комфорта в най-престижния морски комплекс
          </p>
        </div>

        {/* Main stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Card */}
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.iconBg} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
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
          ))}
        </div>

        {/* Additional features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex items-center space-x-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-medium group-hover:text-secondary transition-colors duration-300">
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-6 bg-white/10 backdrop-blur-lg rounded-full px-8 py-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 border-2 border-white flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1K+</span>
                </div>
              </div>
              <div className="text-white">
                <div className="font-semibold">Над 1000 щастливи собственици</div>
                <div className="text-sm text-emerald-200">Присъединете се към тях</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvailabilityCounter;