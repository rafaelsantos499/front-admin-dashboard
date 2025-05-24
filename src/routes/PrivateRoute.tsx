import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../service/Auth/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, isLoadingAuth, logout } = useAuth();

  if (isLoadingAuth) {
    return <div>Carregando...</div>;
  }

  if(!isAuthenticated && isLoadingAuth){
    logout()
  }  

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
