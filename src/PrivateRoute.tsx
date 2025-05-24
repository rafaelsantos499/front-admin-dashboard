import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './service/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return <div>Carregando...</div>; // Pode ser seu spinner
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
