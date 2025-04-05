import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Ventas from './pages/modules/Ventas';
import Inventario from './pages/modules/Inventario';
import Financiero from './pages/modules/Financiero';
import Clientes from './pages/modules/Clientes';
import Productos from './pages/modules/Productos';
import Empleados from './pages/modules/Empleados';
import { CircularProgress, Box, ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme } from './theme';
import Layout from './components/Layout';

// Componente para proteger rutas que requieren autenticación
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/ventas"
            element={
              <PrivateRoute>
                <Layout>
                  <Ventas />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/inventario"
            element={
              <PrivateRoute>
                <Layout>
                  <Inventario />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/financiero"
            element={
              <PrivateRoute>
                <Layout>
                  <Financiero />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <PrivateRoute>
                <Layout>
                  <Clientes />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/productos"
            element={
              <PrivateRoute>
                <Layout>
                  <Productos />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/empleados"
            element={
              <PrivateRoute>
                <Layout>
                  <Empleados />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
