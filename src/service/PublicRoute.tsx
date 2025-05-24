import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PublicRoute = () => {
  const { isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return <div>Carregando...</div>;
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
