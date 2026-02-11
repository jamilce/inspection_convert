import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { I18nProvider } from './contexts/I18nContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { MainLayout } from './components/common/MainLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { HomePage } from './pages/dashboard/HomePage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { CreateAuditPage } from './pages/audits/CreateAuditPage';
import { MailboxPage } from './pages/mailbox/MailboxPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { IncidentsPage } from './pages/incidents/IncidentsPage';
import { EstablishmentsPage } from './pages/establishments/EstablishmentsPage';
import { CreateEstablishmentPage } from './pages/establishments/CreateEstablishmentPage';
import { EmployeesPage } from './pages/employees/EmployeesPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AccessDeniedPage } from './pages/AccessDeniedPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <I18nProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4caf50',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#f44336',
                    secondary: '#fff',
                  },
                },
              }}
            />

            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/access-denied" element={<AccessDeniedPage />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  
                  {/* Audits */}
                  <Route path="/audits/create" element={<CreateAuditPage />} />
                  
                  {/* Establishments */}
                  <Route path="/establishments" element={<EstablishmentsPage />} />
                  <Route path="/establishments/create" element={<CreateEstablishmentPage />} />
                  
                  {/* Mailbox */}
                  <Route path="/mailbox" element={<MailboxPage />} />
                  
                  {/* Reports */}
                  <Route path="/reports" element={<ReportsPage />} />
                  
                  {/* Incidents */}
                  <Route path="/incidents" element={<IncidentsPage />} />
                  
                  {/* Employees */}
                  <Route path="/employees" element={<EmployeesPage />} />
                  
                  {/* Notifications */}
                  <Route path="/notifications" element={<NotificationsPage />} />
                  
                  {/* Profile */}
                  <Route path="/profile" element={<ProfilePage />} />
                  
                  {/* 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Route>
            </Routes>
          </I18nProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
