import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
          Страницата не е намерена
        </h2>
        <p className="text-neutral-600 mb-8">
          Съжаляваме, но страницата която търсите не съществува.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition duration-300"
        >
          <Home className="w-5 h-5" />
          <span>Към началната страница</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;