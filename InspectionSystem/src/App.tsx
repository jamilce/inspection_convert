import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './presentation/components/MainLayout';
import { useAppSelector } from './presentation/hooks/reduxHooks';

import Dashboard from './presentation/pages/dashboard/Dashboard';
import CreateAudit from './presentation/pages/audits/CreateAudit';
import CreateEstablishment from './presentation/pages/establishments/CreateEstablishment';
import Mailbox from './presentation/pages/mailbox/Mailbox';
import Reports from './presentation/pages/reports/Reports';

import Login from './presentation/pages/auth/Login';

const App: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />

        {/* Protected Routes inside MainLayout */}
        <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} /> {/* Redirect root to dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-audit" element={<CreateAudit />} />
          <Route path="/create-establishment" element={<CreateEstablishment />} />
          <Route path="/mailbox" element={<Mailbox />} />
          <Route path="/reports" element={<Reports />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
