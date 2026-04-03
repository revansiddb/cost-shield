import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { ProtectedLayout } from './layouts/ProtectedLayout';

// Public Pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Pricing from './pages/public/Pricing';
import DocsPage from './pages/public/Docs';

// Protected Pages
import Overview from './pages/app/Overview';
import Projects from './pages/app/Projects';
import ProjectDetail from './pages/app/ProjectDetail';
import ProjectAlerts from './pages/app/ProjectAlerts';
import Billing from './pages/app/Billing';
import Settings from './pages/app/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Public Routes (with Header/Footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/docs" element={<DocsPage />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route path="/app" element={<ProtectedLayout />}>
          <Route index element={<Overview />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="projects/:id/alerts" element={<ProjectAlerts />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
