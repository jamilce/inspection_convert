import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

interface PrivilegeRouteProps {
  privilege?: string;
  children: React.ReactNode;
}

export const PrivilegeRoute: React.FC<PrivilegeRouteProps> = ({ privilege, children }) => {
  const { hasPrivilege } = useAuth();

  if (privilege && !hasPrivilege(privilege)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
};
