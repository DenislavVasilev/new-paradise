import React, { useState } from 'react';
import { MessageSquare, Mail, Phone, Calendar, Eye, EyeOff, Loader2, Search, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { useContacts } from '../../lib/hooks/useContacts';

const ContactSubmissions = () => {
  const { contacts, loading, error, markAsRead, markAsUnread } = useContacts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = (
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.phone && contact.phone.includes(searchTerm)) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.apartmentNumber && contact.apartmentNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const matchesFilter = 
      filter === 'all' ||
      (filter === 'read' && contact.isRead) ||
      (filter === 'unread' && !contact.isRead);

    return matchesSearch && matchesFilter;
  });

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await markAsUnread(id);
      } else {
        await markAsRead(id);
      }
    } catch (error) {
      console.error('Error toggling read status:', error);
    }
  };

  const toggleMessageExpansion = (contactId: string) => {
    const newExpanded = new Set(expandedMessages);
    if (newExpanded.has(contactId)) {
      newExpanded.delete(contactId);
    } else {
      newExpanded.add(contactId);
    }
    setExpandedMessages(newExpanded);
  };

  const truncateMessage = (message: string, maxLength: number = 100) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <MessageSquare className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-2xl font-bold">Контакти</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Търсене..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'read' | 'unread')}
            className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Всички</option>
            <option value="read">Прочетени</option>
            <option value="unread">Непрочетени</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Име
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Апартамент
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Имейл
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Телефон
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Съобщение
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className={`hover:bg-gray-50 ${
                    !contact.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        contact.isRead
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {contact.isRead ? 'Прочетено' : 'Ново'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {contact.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {contact.apartmentNumber ? (
                      <div className="flex items-center text-sm text-gray-900">
                        <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                        {contact.apartmentNumber}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <a
                        href={`mailto:${contact.email}`}
                        className="hover:text-primary"
                      >
                        {contact.email}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {contact.phone ? (
                      <div className="flex items-center text-sm text-gray-900">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <a
                          href={`tel:${contact.phone}`}
                          className="hover:text-primary"
                        >
                          {contact.phone}
                        </a>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 min-w-[300px] max-w-md">
                    <div className="text-sm text-gray-900">
                      <p className={expandedMessages.has(contact.id) ? '' : 'line-clamp-3'}>
                        {expandedMessages.has(contact.id) 
                          ? contact.message 
                          : contact.message
                        }
                      </p>
                      <button
                        onClick={() => toggleMessageExpansion(contact.id)}
                        className="mt-2 flex items-center text-primary hover:text-primary-dark text-xs font-medium transition-colors"
                      >
                        {expandedMessages.has(contact.id) ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Скрий
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-1" />
                            Покажи повече
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap min-w-[200px]">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {contact.submittedAt.toLocaleDateString('bg-BG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleToggleRead(contact.id, contact.isRead)}
                      className={`text-gray-600 hover:text-primary transition-colors`}
                      title={contact.isRead ? 'Маркирай като непрочетено' : 'Маркирай като прочетено'}
                    >
                      {contact.isRead ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal for mobile/better reading */}
      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ContactSubmissions;