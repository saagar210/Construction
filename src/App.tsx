import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Layout } from './components/ui/Layout';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { NetworkStatus } from './components/ui/NetworkStatus';
import { ToastContainer } from './components/ui/Toast';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { IncidentListPage } from './components/incidents/IncidentListPage';
import { IncidentCreatePage } from './components/incidents/IncidentCreatePage';
import { IncidentDetailPage } from './components/incidents/IncidentDetailPage';
import { RcaPage } from './components/rca/RcaPage';
import { OshaPage } from './components/osha/OshaPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { SetupWizard } from './components/settings/SetupWizard';
import { ImportPage } from './components/import/ImportPage';
import { ToolboxTalksPage } from './pages/ToolboxTalksPage';
import { ToolboxCreatePage } from './pages/ToolboxCreatePage';
import { ToolboxTalkDetailPage } from './pages/ToolboxTalkDetailPage';
import { JsaPage } from './pages/JsaPage';
import { useSettingsStore } from './stores/settingsStore';
import { useKeyboardShortcuts, createGlobalShortcuts } from './hooks/useKeyboardShortcuts';
import './index.css';

function AppRoutes() {
  const navigate = useNavigate();

  // Enable global keyboard shortcuts with React Router navigation
  useKeyboardShortcuts(createGlobalShortcuts(navigate));

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/incidents" element={<IncidentListPage />} />
        <Route path="/incidents/new" element={<IncidentCreatePage />} />
        <Route path="/incidents/:id" element={<IncidentDetailPage />} />
        <Route path="/incidents/:id/rca" element={<RcaPage />} />
        <Route path="/osha" element={<OshaPage />} />
        <Route path="/import" element={<ImportPage />} />
        <Route path="/toolbox" element={<ToolboxTalksPage />} />
        <Route path="/toolbox/new" element={<ToolboxCreatePage />} />
        <Route path="/toolbox/:id" element={<ToolboxTalkDetailPage />} />
        <Route path="/jsa" element={<JsaPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  );
}

function App() {
  const { loadEstablishments, establishments, loading } = useSettingsStore();

  useEffect(() => {
    loadEstablishments();
  }, [loadEstablishments]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-safety-orange mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!loading && establishments.length === 0) {
    return <SetupWizard />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <NetworkStatus />
        <ToastContainer />
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
