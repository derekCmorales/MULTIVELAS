import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  CardActions,
  useTheme,
} from '@mui/material';
import {
  ShoppingCart as VentasIcon,
  Inventory as InventarioIcon,
  AccountBalance as FinancieroIcon,
  People as ClientesIcon,
  Person as EmpleadosIcon,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const modules = [
    {
      title: 'Ventas',
      description: 'Gestión de ventas y facturación',
      icon: <VentasIcon sx={{ fontSize: 40 }} />,
      path: '/ventas',
      color: theme.palette.primary.main,
    },
    {
      title: 'Inventario',
      description: 'Control de stock y productos',
      icon: <InventarioIcon sx={{ fontSize: 40 }} />,
      path: '/inventario',
      color: theme.palette.secondary.main,
    },
    {
      title: 'Financiero',
      description: 'Gestión financiera y contable',
      icon: <FinancieroIcon sx={{ fontSize: 40 }} />,
      path: '/financiero',
      color: '#FF9800',
    },
    {
      title: 'Clientes',
      description: 'Gestión de clientes y contactos',
      icon: <ClientesIcon sx={{ fontSize: 40 }} />,
      path: '/clientes',
      color: '#4CAF50',
    },
    {
      title: 'Empleados',
      description: 'Gestión de personal y roles',
      icon: <EmpleadosIcon sx={{ fontSize: 40 }} />,
      path: '/empleados',
      color: '#9C27B0',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              color: theme.palette.text.primary,
            }}
          >
            Panel de Control
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: theme.palette.text.secondary,
            }}
          >
            Bienvenido al sistema de gestión empresarial de MULTIVELAS
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {modules.map((module) => (
            <Grid item xs={12} sm={6} md={4} key={module.title}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease-in-out',
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 24px ${theme.palette.primary.main}20`,
                    borderColor: module.color,
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Box 
                    sx={{ 
                      color: module.color, 
                      mb: 2,
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: `${module.color}15`,
                    }}
                  >
                    {module.icon}
                  </Box>
                  <Typography 
                    gutterBottom 
                    variant="h5" 
                    component="h2"
                    sx={{ 
                      fontWeight: 'bold',
                      color: theme.palette.text.primary,
                    }}
                  >
                    {module.title}
                  </Typography>
                  <Typography
                    sx={{ 
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {module.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate(module.path)}
                    sx={{ 
                      backgroundColor: module.color,
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: module.color,
                        opacity: 0.9,
                      },
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 4,
                      py: 1,
                    }}
                  >
                    Acceder
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard; 