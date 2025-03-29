import { useState, useEffect } from 'react';
import axios from 'axios';

interface LoginResponse {
  token: string;
  empleado: {
    id: string;
    nombre: string;
    email: string;
    rol: string;
  };
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const useAuth = (): AuthContextType => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:4000/api/empleados/perfil', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<LoginResponse>('http://localhost:4000/api/empleados/login', {
        email,
        password,
      });

      const { token, empleado } = response.data;
      localStorage.setItem('token', token);
      setUser(empleado);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error('Error de autenticación');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
    isLoading
  };
}; 