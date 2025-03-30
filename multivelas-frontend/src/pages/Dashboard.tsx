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

  const modules = [
    {
      title: 'Ventas',
      description: 'Gestión de ventas y facturación',
      icon: <VentasIcon sx={{ fontSize: 40 }} />,
      path: '/ventas',
      color: '#1976d2',
    },
    {
      title: 'Inventario',
      description: 'Control de stock y productos',
      icon: <InventarioIcon sx={{ fontSize: 40 }} />,
      path: '/inventario',
      color: '#2e7d32',
    },
    {
      title: 'Financiero',
      description: 'Gestión financiera y contable',
      icon: <FinancieroIcon sx={{ fontSize: 40 }} />,
      path: '/financiero',
      color: '#ed6c02',
    },
    {
      title: 'Clientes',
      description: 'Gestión de clientes y contactos',
      icon: <ClientesIcon sx={{ fontSize: 40 }} />,
      path: '/clientes',
      color: '#9c27b0',
    },
    {
      title: 'Empleados',
      description: 'Gestión de personal y roles',
      icon: <EmpleadosIcon sx={{ fontSize: 40 }} />,
      path: '/empleados',
      color: '#607d8b',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Panel de Control
        </Typography>
        <Grid container spacing={3}>
          {modules.map((module) => (
            <Grid item xs={12} sm={6} md={4} key={module.title}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ color: module.color, mb: 2 }}>
                    {module.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h2">
                    {module.title}
                  </Typography>
                  <Typography>
                    {module.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate(module.path)}
                    sx={{ 
                      backgroundColor: module.color,
                      '&:hover': {
                        backgroundColor: module.color,
                        opacity: 0.9,
                      }
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