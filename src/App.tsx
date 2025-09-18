import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { useAuthStore } from './lib/store';

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import FloorNavigatorPage from "./pages/FloorNavigatorPage";
import ApartmentCatalogPage from "./pages/ApartmentCatalogPage";
import ApartmentDetailsPage from "./pages/ApartmentDetailsPage";
import ParkingPage from "./pages/ParkingPage";
import ParkingDetailsPage from "./pages/ParkingDetailsPage";
import GalleryPage from "./pages/GalleryPage";
import NotFoundPage from "./pages/NotFoundPage";

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import LoginPage from './pages/admin/LoginPage';
import Dashboard from './pages/admin/Dashboard';
import HomepageEditor from './pages/admin/HomepageEditor';
import FloorPlansEditor from './pages/admin/FloorPlansEditor';
import ApartmentsEditor from './pages/admin/ApartmentsEditor';
import ParkingEditor from './pages/admin/ParkingEditor';
import StoresEditor from './pages/admin/StoresEditor';
import MediaLibrary from './pages/admin/MediaLibrary';
import Settings from './pages/admin/Settings';
import ContactSubmissions from './pages/admin/ContactSubmissions';

// Component to handle scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const { setUser, setIsAdmin, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      try {
        if (user) {
          setUser(user);
          setIsAdmin(true);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, setIsAdmin, setLoading]);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="homepage" element={<HomepageEditor />} />
          <Route path="floor-plans" element={<FloorPlansEditor />} />
          <Route path="apartments" element={<ApartmentsEditor />} />
          <Route path="parking" element={<ParkingEditor />} />
          <Route path="stores" element={<StoresEditor />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="contacts" element={<ContactSubmissions />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>

        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="navigator" element={<FloorNavigatorPage />} />
          <Route path="navigator/:entrance/:floor" element={<FloorNavigatorPage />} />
          <Route path="apartments" element={<ApartmentCatalogPage />} />
          <Route path="apartments/:id" element={<ApartmentDetailsPage />} />
          <Route path="parking" element={<ParkingPage />} />
          <Route path="parking/:id" element={<ParkingDetailsPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

// PublicLayout component to wrap public routes
const PublicLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default App;