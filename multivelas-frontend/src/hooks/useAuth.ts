import { useState, useEffect } from 'react';
import { authService } from '../services/api';
import { ApiResponse } from '../types/api';
import { Empleado } from '../types/models';

interface LoginResponse {
  token: string;
  empleado: Empleado;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: Empleado | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export const useAuth = (): AuthContextType => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Empleado | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authService.obtenerPerfil();
          if (response.data.success) {
            setUser(response.data.data);
            setIsAuthenticated(true);
          } else {
            throw new Error(response.data.message);
          }
        } catch (error) {
          console.error('Error al verificar autenticación:', error);
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(email, password);
      console.log('Respuesta del login:', response.data); // Para depuración

      if (response.data.success) {
        const { token, empleado } = response.data.data;
        localStorage.setItem('token', token);
        setUser(empleado);
        setIsAuthenticated(true);
        return true;
      } else {
        throw new Error(response.data.message || 'Error de autenticación');
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      throw error.response?.data?.message || 'Error al iniciar sesión';
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