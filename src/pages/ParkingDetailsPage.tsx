import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, Square, Euro } from 'lucide-react';

const ParkingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // This would be replaced with actual data fetching
  const parking = {
    id: id,
    number: '101',
    type: 'covered',
    size: '2.5m x 5m',
    price: 15000,
    status: 'available',
    description: 'Закрито паркомясто с лесен достъп',
    features: [
      'Денонощна охрана',
      'Видеонаблюдение',
      'Автоматична врата',
      'LED осветление',
    ],
    images: [
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80',
    ]
  };

  return (
    <div className="pt-24 pb-16 bg-neutral-50">
      <div className="container-custom">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-primary hover:text-primary-dark mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Назад
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={parking.images[0]}
                alt={`Паркомясто ${parking.number}`}
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4">
              {parking.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Изглед ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition duration-300"
                />
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">
              Паркомясто {parking.number}
            </h1>
            <p className="text-neutral-600 mb-6">{parking.description}</p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Car className="w-6 h-6 text-primary mb-2" />
                <div className="text-sm text-neutral-600">Тип</div>
                <div className="text-lg font-semibold">
                  {parking.type === 'covered' ? 'Закрито' : 'Открито'}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Square className="w-6 h-6 text-primary mb-2" />
                <div className="text-sm text-neutral-600">Размери</div>
                <div className="text-lg font-semibold">{parking.size}</div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Характеристики</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {parking.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-neutral-600">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-neutral-600">Цена</div>
                <div className="text-2xl font-bold text-primary">
                  €{parking.price.toLocaleString()}
                </div>
              </div>
              <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-300">
                Свържете се с нас
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingDetailsPage;