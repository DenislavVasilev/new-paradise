import React from 'react';
import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Footer = () => {
  const [showNavigator, setShowNavigator] = useState(false);

  useEffect(() => {
    const checkForFloorPlans = async () => {
      try {
        const q = query(collection(db, 'floorPlans'));
        const querySnapshot = await getDocs(q);
        setShowNavigator(querySnapshot.size > 0);
      } catch (error) {
        console.error('Error checking floor plans:', error);
        setShowNavigator(false);
      }
    };

    checkForFloorPlans();
  }, []);

  return (
    <footer className="bg-primary text-white py-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-sans mb-6">
              <span className="text-secondary">Paradise</span> Green Park
            </h3>
            <p className="text-neutral-200 mb-6">
              Луксозен апартаментен комплекс в сърцето на Златни пясъци с изглед към морето.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6">Връзки в сайта</h3>
            <div className="space-y-3">
              <Link to="/" className="block text-neutral-200 hover:text-secondary transition duration-300">
                Начало
              </Link>
              <Link to="/apartments" className="block text-neutral-200 hover:text-secondary transition duration-300">
                Апартаменти
              </Link>
              <Link to="/gallery" className="block text-neutral-200 hover:text-secondary transition duration-300">
                Галерия
              </Link>
              {showNavigator && (
                <Link to="/navigator" className="block text-neutral-200 hover:text-secondary transition duration-300">
                  Навигатор
                </Link>
              )}
              <a href="/#contact" className="block text-neutral-200 hover:text-secondary transition duration-300">
                Контакти
              </a>
              <a href="/#location" className="block text-neutral-200 hover:text-secondary transition duration-300">
                Локация
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6">Контакти</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3" />
                <a href="tel:+359889660000" className="hover:text-secondary transition duration-300">
                  0889 66 00 00
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3" />
                <a href="mailto:office@imoti.bg" className="hover:text-secondary transition duration-300">
                  office@imoti.bg
                </a>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-1" />
                <span>Златни пясъци<br />9007, Варна, България</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-neutral-300">
          <p>© {new Date().getFullYear()} Paradise Green Park. Всички права запазени.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;