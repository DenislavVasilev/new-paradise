import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  const isHomePage = location.pathname === '/';

  const handleScrollTo = (elementId: string) => {
    setIsMobileMenuOpen(false);
    if (!isHomePage) {
      navigate('/', { state: { scrollTo: elementId } });
      return;
    }
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state, navigate]);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || !isHomePage ? 'bg-primary shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between">
          <a
            href="/"
            onClick={handleHomeClick}
            className="flex items-center space-x-3"
          >
            <div className="text-2xl font-bold text-white">
              <span className="text-secondary">Paradise</span>
              <span className="ml-1">Green Park</span>
            </div>
          </a>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/apartments"
              className="text-white hover:text-secondary transition duration-300"
            >
              Апартаменти
            </Link>
            
            <Link
              to="/gallery"
              className="text-white hover:text-secondary transition duration-300"
            >
              Галерия
            </Link>
            
            {showNavigator && (
              <Link
                to="/navigator"
                className="text-white hover:text-secondary transition duration-300"
              >
                Навигатор
              </Link>
            )}

            <button
              onClick={() => handleScrollTo('location')}
              className="text-white hover:text-secondary transition duration-300"
            >
              Локация
            </button>
            
            <button
              onClick={() => handleScrollTo('contact')}
              className="text-white hover:text-secondary transition duration-300"
            >
              Контакти
            </button>
            
            <a
              href="tel:0889660000"
              className="flex items-center space-x-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary-dark transition duration-300"
            >
              <Phone size={18} />
              <span>0889 66 00 00</span>
            </a>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-primary shadow-lg py-4">
            <div className="flex flex-col space-y-4 px-4">
              <Link
                to="/apartments"
                className="text-white hover:text-secondary transition duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Апартаменти
              </Link>
              
              <Link
                to="/gallery"
                className="text-white hover:text-secondary transition duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Галерия
              </Link>
              
              {showNavigator && (
                <Link
                  to="/navigator"
                  className="text-white hover:text-secondary transition duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Навигатор
                </Link>
              )}

              <button
                onClick={() => handleScrollTo('location')}
                className="text-white hover:text-secondary transition duration-300 text-left"
              >
                Локация
              </button>
              
              <button
                onClick={() => handleScrollTo('contact')}
                className="text-white hover:text-secondary transition duration-300 text-left"
              >
                Контакти
              </button>
              
              <a
                href="tel:0889660000"
                className="flex items-center space-x-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary-dark transition duration-300"
              >
                <Phone size={18} />
                <span>0889 66 00 00</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;