import React, { useState } from 'react';
import { Mail, Phone, User, MessageSquare, Loader2, Building2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ContactFormProps {
  apartmentNumber?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ apartmentNumber }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    apartmentNumber: apartmentNumber || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        submittedAt: new Date(),
        isRead: false
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        apartmentNumber: apartmentNumber || ''
      });

      setSubmitStatus({
        type: 'success',
        message: 'Благодарим ви за интереса! Ще се свържем с вас в най-скоро време.'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Възникна грешка. Моля, опитайте отново.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-neutral-50 to-white" id="contact">
      <div className="container-custom max-w-2xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Заявете безплатна консултация
          </h2>
          <p className="text-lg text-neutral-600 max-w-xl mx-auto">
            Нашите експерти ще ви помогнат да изберете перфектния апартамент за вас.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-neutral-100">
        {submitStatus.type && (
          <div
            className={`mb-8 p-6 rounded-xl text-center border ${
              submitStatus.type === 'success'
                ? 'bg-green-50 text-green-800 border-green-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            <div className="flex items-center justify-center mb-2">
              {submitStatus.type === 'success' ? (
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
              ) : (
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-lg">!</span>
                </div>
              )}
            </div>
            <p className="font-medium">{submitStatus.message}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                Вашето име *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-neutral-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Въведете вашето име"
                  className="block w-full pl-12 pr-4 py-4 border-2 border-neutral-200 rounded-xl focus:outline-none focus:ring-0 focus:border-primary text-base transition-all duration-200 hover:border-neutral-300"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                Имейл адрес *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="block w-full pl-12 pr-4 py-4 border-2 border-neutral-200 rounded-xl focus:outline-none focus:ring-0 focus:border-primary text-base transition-all duration-200 hover:border-neutral-300"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-neutral-700 mb-3">
              Телефон за връзка
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-neutral-400 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+359 888 123 456"
                className="block w-full pl-12 pr-4 py-4 border-2 border-neutral-200 rounded-xl focus:outline-none focus:ring-0 focus:border-primary text-base transition-all duration-200 hover:border-neutral-300"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {apartmentNumber && (
            <div className="group">
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                Апартамент
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  name="apartmentNumber"
                  value={formData.apartmentNumber}
                  onChange={handleChange}
                  placeholder="Апартамент"
                  className="block w-full pl-12 pr-4 py-4 border-2 border-neutral-200 rounded-xl bg-neutral-50 text-base"
                  readOnly
                />
              </div>
            </div>
          )}

          <div className="group">
            <label className="block text-sm font-semibold text-neutral-700 mb-3">
              Вашето съобщение *
            </label>
            <div className="relative">
              <div className="absolute top-4 left-4 pointer-events-none">
                <MessageSquare className="h-5 w-5 text-neutral-400 group-focus-within:text-primary transition-colors" />
              </div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Разкажете ни повече за вашите изисквания..."
                rows={5}
                className="block w-full pl-12 pr-4 py-4 border-2 border-neutral-200 rounded-xl focus:outline-none focus:ring-0 focus:border-primary text-base resize-none transition-all duration-200 hover:border-neutral-300"
                required
                disabled={isSubmitting}
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-secondary to-secondary-dark text-white px-8 py-5 rounded-xl font-semibold text-lg hover:from-secondary-dark hover:to-secondary transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                Изпращане...
              </>
            ) : (
              <>
                <MessageSquare className="w-6 h-6 mr-3" />
                Заяви консултация
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
          <p className="text-sm text-neutral-500">
            Ще се свържем с вас в рамките на <span className="font-semibold text-primary">24 часа</span>
          </p>
        </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;