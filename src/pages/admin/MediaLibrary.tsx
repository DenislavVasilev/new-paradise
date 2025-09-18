import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon, File, X, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { storage, db, auth } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, query, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document';
  category?: string;
  size: number;
  uploadedAt: Date;
  storagePath: string;
}

const MediaLibrary = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('apartments');

  const galleryCategories = [
    { id: 'apartments', name: 'Апартаменти' },
    { id: 'common-areas', name: 'Общи части' },
    { id: 'pool', name: 'Басейн' },
    { id: 'sea-view', name: 'Изглед към морето' },
    { id: 'surroundings', name: 'Околност' }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchMediaFiles();
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  const fetchMediaFiles = async () => {
    try {
      const q = query(collection(db, 'media'), orderBy('uploadedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const files = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt.toDate()
      })) as MediaFile[];
      setMediaFiles(files);
    } catch (error) {
      console.error('Error fetching media files:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    // Check if user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert('Моля, влезте в системата за да качите файлове');
      return;
    }

    setIsUploading(true);
    try {
      // Force refresh the auth token
      await currentUser.getIdToken(true);
      
      // Wait a bit for the token to be processed
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      for (const file of acceptedFiles) {
        const timestamp = Date.now();
        const storagePath = `media/${timestamp}_${file.name}`;
        const storageRef = ref(storage, storagePath);
        
        // Upload file to Firebase Storage
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        
        // Add file metadata to Firestore
        const mediaData = {
          name: file.name,
          url: downloadUrl,
          type: file.type.startsWith('image/') ? 'image' : 'document',
          category: selectedCategory,
          size: file.size,
          uploadedAt: new Date(),
          storagePath: storagePath
        };
        
        await addDoc(collection(db, 'media'), mediaData);
      }
      
      // Refresh the media files list
      await fetchMediaFiles();
    } catch (error) {
      console.error('Error uploading files:', error);
      if (error.code === 'storage/unauthorized' || error.code === 'auth/invalid-user-token') {
        alert('Нямате права за качване на файлове. Моля, излезте и влезте отново в системата.');
        // Redirect to login
        window.location.href = '/admin/login';
      } else {
        alert('Грешка при качване на файловете: ' + error.message);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'application/pdf': ['.pdf']
    },
    disabled: isUploading
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDelete = async (id: string, storagePath: string) => {
    try {
      // Delete from Storage
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'media', id));
      
      // Update UI
      setMediaFiles(files => files.filter(file => file.id !== id));
      setSelectedFiles(selected => selected.filter(fileId => fileId !== id));
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Грешка при изтриване на файла');
    }
  };

  const toggleFileSelection = (id: string) => {
    setSelectedFiles(selected =>
      selected.includes(id)
        ? selected.filter(fileId => fileId !== id)
        : [...selected, id]
    );
  };

  const deleteSelected = async () => {
    try {
      for (const id of selectedFiles) {
        const file = mediaFiles.find(f => f.id === id);
        if (file) {
          await handleDelete(file.id, file.storagePath);
        }
      }
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error deleting selected files:', error);
      alert('Грешка при изтриване на избраните файлове');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Медийна библиотека</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Категория:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {galleryCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {selectedFiles.length > 0 && (
            <button
              onClick={deleteSelected}
              className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Изтрий избраните ({selectedFiles.length})
            </button>
          )}
          <div className="flex rounded-lg border border-gray-200">
            <button
              onClick={() => setView('grid')}
              className={`px-4 py-2 ${
                view === 'grid'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              } rounded-l-lg transition-colors`}
            >
              Решетка
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 ${
                view === 'list'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              } rounded-r-lg transition-colors`}
            >
              Списък
            </button>
          </div>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`mb-6 border-2 border-dashed rounded-lg p-8 text-center ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-gray-600">Качване на файлове...</p>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {isDragActive
                ? 'Пуснете файловете тук...'
                : 'Плъзнете файлове тук или кликнете, за да изберете'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Поддържани формати: JPG, PNG, GIF, PDF
            </p>
          </>
        )}
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {mediaFiles.map(file => (
            <div
              key={file.id}
              className={`relative group rounded-lg border ${
                selectedFiles.includes(file.id)
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200'
              }`}
            >
              <div className="aspect-square p-4">
                {file.type === 'image' ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                    <File className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-gray-200">
                <p className="text-sm font-medium truncate" title={file.name}>
                  {file.name}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  {file.category && (
                    <span className="text-xs bg-primary text-white px-2 py-1 rounded">
                      {galleryCategories.find(cat => cat.id === file.category)?.name || file.category}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => toggleFileSelection(file.id)}
                className={`absolute top-2 right-2 p-1 rounded-full ${
                  selectedFiles.includes(file.id)
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-500 opacity-0 group-hover:opacity-100'
                } transition-opacity`}
              >
                {selectedFiles.includes(file.id) ? (
                  <X className="w-4 h-4" />
                ) : (
                  <ImageIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Файл
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Размер
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Качен на
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mediaFiles.map(file => (
                <tr
                  key={file.id}
                  className={selectedFiles.includes(file.id) ? 'bg-primary/5' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {file.type === 'image' ? (
                        <ImageIcon className="w-5 h-5 text-gray-400 mr-3" />
                      ) : (
                        <File className="w-5 h-5 text-gray-400 mr-3" />
                      )}
                      <span className="text-sm text-gray-900">{file.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">
                      {file.type === 'image' ? 'Изображение' : 'Документ'}
                      {file.category && (
                        <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded">
                          {galleryCategories.find(cat => cat.id === file.category)?.name || file.category}
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">
                      {file.uploadedAt.toLocaleDateString('bg-BG')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(file.id, file.storagePath)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;