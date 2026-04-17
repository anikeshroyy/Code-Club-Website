import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './theme/ThemeContext';
import GlobalStyles from './theme/globalStyles';
import useServerPing from './hooks/useServerPing';
import Layout from './components/layout/Layout';

// Public pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ResourcesPage from './pages/ResourcesPage';
import GalleryPage from './pages/GalleryPage';
import JoinPage from './pages/JoinPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import EventsPage from './pages/EventsPage';
import ArchivedEventsPage from './pages/ArchivedEventsPage';
import SocialMediaPage from './pages/SocialMediaPage';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageTeam from './pages/admin/ManageTeam';
import ManageFaculty from './pages/admin/ManageFaculty';
import ManageGallery from './pages/admin/ManageGallery';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';
import ManageEvents from './pages/admin/ManageEvents';
import ManageApplications from './pages/admin/ManageApplications';
import ManageAdmins from './pages/admin/ManageAdmins';
import ManageResources from './pages/admin/ManageResources';
import ProtectedRoute from './components/admin/ProtectedRoute';

const App: React.FC = () => {
  // Keep Render backend awake — pings /api/health every 4 minutes
  useServerPing();

  return (
    <HelmetProvider>
    <ThemeProvider>
      <GlobalStyles />
      <Router>
        <Routes>
          {/* ── Public routes (with Navbar/Footer layout) ── */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/join" element={<JoinPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/archive" element={<ArchivedEventsPage />} />
            <Route path="/social" element={<SocialMediaPage />} />
          </Route>

          {/* ── Admin login (no layout) ── */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ── Protected admin routes ── */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route index element={<AdminDashboard />} />
            <Route path="team" element={<ManageTeam />} />
            <Route path="faculty" element={<ManageFaculty />} />
            <Route path="gallery" element={<ManageGallery />} />
            <Route path="announcements" element={<ManageAnnouncements />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="applications" element={<ManageApplications />} />
            <Route path="admins" element={<ManageAdmins />} />
            <Route path="resources" element={<ManageResources />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
