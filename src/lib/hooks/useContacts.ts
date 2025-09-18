import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  apartmentNumber?: string;
  submittedAt: Date;
  isRead: boolean;
}

export const useContacts = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'contacts'),
        orderBy('submittedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const contactData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt.toDate()
      })) as ContactSubmission[];

      setContacts(contactData);
      setError(null);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Грешка при зареждане на контактите');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const contactRef = doc(db, 'contacts', id);
      await updateDoc(contactRef, { isRead: true });
      setContacts(contacts.map(contact =>
        contact.id === id ? { ...contact, isRead: true } : contact
      ));
    } catch (err) {
      console.error('Error marking contact as read:', err);
      throw new Error('Грешка при маркиране като прочетено');
    }
  };

  const markAsUnread = async (id: string) => {
    try {
      const contactRef = doc(db, 'contacts', id);
      await updateDoc(contactRef, { isRead: false });
      setContacts(contacts.map(contact =>
        contact.id === id ? { ...contact, isRead: false } : contact
      ));
    } catch (err) {
      console.error('Error marking contact as unread:', err);
      throw new Error('Грешка при маркиране като непрочетено');
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return {
    contacts,
    loading,
    error,
    markAsRead,
    markAsUnread,
    refreshContacts: fetchContacts
  };
};