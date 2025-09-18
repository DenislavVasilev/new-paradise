import React, { useState, useEffect } from 'react';
import { Building2, Car, MessageSquare, LayoutTemplate, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Action {
  id: string;
  type: string;
  description: string;
  timestamp: Timestamp;
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    availableApartments: 0,
    availableParking: 0,
    contacts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch available apartments count
        const apartmentsQuery = query(
          collection(db, 'apartments'),
          where('status', '==', 'available')
        );
        const apartmentsSnapshot = await getDocs(apartmentsQuery);
        const availableApartmentsCount = apartmentsSnapshot.size;

        // Fetch available parking spots
        const parkingQuery = query(
          collection(db, 'parkingSpots'),
          where('status', '==', 'available')
        );
        const parkingSnapshot = await getDocs(parkingQuery);
        const availableParkingCount = parkingSnapshot.size;

        // Fetch contacts count
        const contactsSnapshot = await getDocs(collection(db, 'contacts'));
        const contactsCount = contactsSnapshot.size;

        setStats({
          availableApartments: availableApartmentsCount,
          availableParking: availableParkingCount,
          contacts: contactsCount
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      title: 'Свободни апартаменти',
      value: stats.availableApartments,
      icon: Building2,
      color: 'blue'
    },
    {
      title: 'Свободни паркоместа',
      value: stats.availableParking,
      icon: Car,
      color: 'green'
    },
    {
      title: 'Запитвания',
      value: stats.contacts,
      icon: MessageSquare,
      color: 'purple'
    }
  ];

  const quickActions = [
    {
      title: 'Добави апартамент',
      icon: Building2,
      color: 'blue',
      link: '/admin/apartments'
    },
    {
      title: 'Добави паркомясто',
      icon: Car,
      color: 'green',
      link: '/admin/parking'
    },
    {
      title: 'Виж запитвания',
      icon: MessageSquare,
      color: 'purple',
      link: '/admin/contacts'
    },
    {
      title: 'Добави етажен план',
      icon: LayoutTemplate,
      color: 'orange',
      link: '/admin/floor-plans'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Табло</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 transition-transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 text-${stat.color}-500`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Бързи действия</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 border-${action.color}-100 hover:bg-${action.color}-50 transition-all duration-300 group`}
              >
                <action.icon className={`w-8 h-8 text-${action.color}-500 mb-2 group-hover:scale-110 transition-transform`} />
                <span className="text-sm font-medium text-gray-700 text-center">
                  {action.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;