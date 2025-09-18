import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
              to="/navigator"
              className="text-white hover:text-secondary transition duration-300"
            >
              Навигатор
            </Link>
            
            <div className="relative group">
              <button className="flex items-center space-x-1 text-white group-hover:text-secondary transition-colors duration-300">
                <span>Обекти</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              
              <div className="absolute left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="py-2 bg-white rounded-lg shadow-xl">
                  <Link
                    to="/apartments"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors duration-300"
                  >
                    Апартаменти
                  </Link>
                  <Link
                    to="/parking"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors duration-300"
                  >
                    Паркоместа
                  </Link>
                  <Link
                    to="/gallery"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors duration-300"
                  >
                    Галерия
                  </Link>
                </div>
              </div>
            </div>

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
                to="/navigator"
                className="text-white hover:text-secondary transition duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Навигатор
              </Link>
              
              <div className="space-y-2 pl-4">
                <Link
                  to="/apartments"
                  className="block text-white hover:text-secondary transition duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Апартаменти
                </Link>
                <Link
                  to="/parking"
                  className="block text-white hover:text-secondary transition duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Паркоместа
                </Link>
                <Link
                  to="/gallery"
                  className="block text-white hover:text-secondary transition duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Галерия
                </Link>
              </div>

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