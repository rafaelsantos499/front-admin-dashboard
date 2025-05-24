import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { LoginDto } from '../types/dto/LoginDTO';
import { login as loginRequest, me } from './authService';
import { User } from '../types/User';

interface AuthContextType {
  user: User | null;
  token: string;
  refreshToken: string;
  isLoadingLogin: boolean;
  isLoadingAuth: boolean;      // novo estado para controlar loading da autenticação inicial
  isAuthenticated: boolean;
  login: (payload: LoginDto) => Promise<void>;
  logout: () => void;
  setSession: (accessToken: string, refreshToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verifica token e usuário ao montar o componente
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      meUser().finally(() => setIsLoadingAuth(false));
    } else {
      setIsAuthenticated(false);
      setIsLoadingAuth(false);
    }
  }, []);

  // Busca dados do usuário usando token
  const meUser = async () => {
    try {
      // A função me() deve receber o token para enviar no header
      const response = await me();
      if (response) {
        setUser(response);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch {
      logout();
    }
  };

  const login = async (payload: LoginDto) => {
    setIsLoadingLogin(true);
    try {
      const { user, accessToken, refreshToken } = await loginRequest(payload);

      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        setToken(accessToken);
        setRefreshToken(refreshToken);
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refresh-token', refreshToken);
      }
    } finally {
      setIsLoadingLogin(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    setRefreshToken('');
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh-token');
  };

  // Função para atualizar token e refreshToken (ex: refresh token)
  const setSession = async (accessToken: string, refreshToken: string) => {
    setToken(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refresh-token', refreshToken);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        isLoadingLogin,
        isLoadingAuth,
        isAuthenticated,
        login,
        logout,
        setSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
