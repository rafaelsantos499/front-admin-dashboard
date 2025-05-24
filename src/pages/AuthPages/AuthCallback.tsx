import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../service/Auth/AuthContext';

const AuthCallback = () => {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
      setSession(accessToken, refreshToken).then(() => {
        navigate('/'); // só navega depois de autenticar com sucesso
      });
    } else {
      navigate('/signin');
    }
  }, [location.search, navigate, setSession]);

  return <div>Autenticando com o Google...</div>;
};

export default AuthCallback;
