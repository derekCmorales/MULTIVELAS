import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ApiResponse } from '../../types/api';
import { toast } from 'react-toastify';

interface Cliente {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  estado: string;
  ventas?: Venta[];
}

interface Venta {
  _id: string;
  fecha: string;
  total: number;
  estado: string;
}

const Clientes: React.FC = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [open, setOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    estado: 'activo'
  });
  const [errors, setErrors] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    estado: ''
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<ApiResponse<Cliente[]>>('http://localhost:4000/api/clientes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setClientes(response.data.data);
      } else {
        console.error('Error en la respuesta:', response.data.message);
        toast.error('Error al cargar clientes');
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      toast.error('Error al cargar clientes');
    }
  };

  const handleOpen = (cliente?: Cliente) => {
    if (cliente) {
      setEditingCliente(cliente);
      setFormData({
        nombre: cliente.nombre,
        email: cliente.email,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        estado: cliente.estado
      });
    } else {
      setEditingCliente(null);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        estado: 'activo'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCliente(null);
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
      estado: 'activo'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const clienteData = {
        ...formData,
        estado: 'activo'
      };

      if (editingCliente) {
        const response = await axios.put<ApiResponse<Cliente>>(
          `http://localhost:4000/api/clientes/${editingCliente._id}`,
          clienteData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          toast.success('Cliente actualizado correctamente');
          handleClose();
          fetchClientes();
        } else {
          toast.error(response.data.message || 'Error al actualizar cliente');
        }
      } else {
        const response = await axios.post<ApiResponse<Cliente>>(
          'http://localhost:4000/api/clientes/registro',
          clienteData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          toast.success('Cliente creado correctamente');
          handleClose();
          fetchClientes();
        } else {
          toast.error(response.data.message || 'Error al crear cliente');
        }
      }
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      toast.error('Error al guardar cliente');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete<ApiResponse<void>>(`http://localhost:4000/api/clientes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          toast.success('Cliente eliminado correctamente');
          fetchClientes();
        } else {
          toast.error(response.data.message || 'Error al eliminar cliente');
        }
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
        toast.error('Error al eliminar cliente');
      }
    }
  };

  const calcularEstadisticasCliente = (cliente: Cliente) => {
    const ventasCompletadas = cliente.ventas?.filter(v => v.estado === 'completada') || [];
    const ventasPendientes = cliente.ventas?.filter(v => v.estado === 'pendiente') || [];

    return {
      totalVentas: ventasCompletadas.length,
      totalIngresos: ventasCompletadas.reduce((sum, v) => sum + v.total, 0),
      totalPendientes: ventasPendientes.reduce((sum, v) => sum + v.total, 0)
    };
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  return (
    <Box>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MultiVelas
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4">Gestión de Clientes</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Nuevo Cliente
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Ventas Completadas</TableCell>
                  <TableCell>Ventas Pendientes</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientes.map((cliente) => {
                  const ventasCompletadas = cliente.ventas?.filter(v => v.estado === 'completada') || [];
                  const ventasPendientes = cliente.ventas?.filter(v => v.estado === 'pendiente') || [];
                  const totalCompletadas = ventasCompletadas.reduce((sum, v) => sum + v.total, 0);
                  const totalPendientes = ventasPendientes.reduce((sum, v) => sum + v.total, 0);

                  return (
                    <TableRow key={cliente._id}>
                      <TableCell>{cliente.nombre ? cliente.nombre.charAt(0).toUpperCase() + cliente.nombre.slice(1) : ''}</TableCell>
                      <TableCell>{cliente.email || ''}</TableCell>
                      <TableCell>{cliente.telefono || ''}</TableCell>
                      <TableCell>{cliente.direccion ? cliente.direccion.charAt(0).toUpperCase() + cliente.direccion.slice(1) : ''}</TableCell>
                      <TableCell>
                        <Typography
                          color={cliente.estado === 'activo' ? 'success.main' : 'error.main'}
                        >
                          {cliente.estado ? cliente.estado.charAt(0).toUpperCase() + cliente.estado.slice(1) : ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="success.main">
                          Q{totalCompletadas.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="warning.main">
                          Q{totalPendientes.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleOpen(cliente)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(cliente._id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  label="Nombre"
                  value={formData.nombre}
                  onChange={(e) => handleFieldChange('nombre', e.target.value)}
                  error={!!errors.nombre}
                  helperText={errors.nombre}
                  fullWidth
                />

                <TextField
                  label="Email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                />

                <TextField
                  label="Teléfono"
                  value={formData.telefono}
                  onChange={(e) => handleFieldChange('telefono', e.target.value)}
                  error={!!errors.telefono}
                  helperText={errors.telefono}
                  fullWidth
                />

                <TextField
                  label="Dirección"
                  value={formData.direccion}
                  onChange={(e) => handleFieldChange('direccion', e.target.value)}
                  error={!!errors.direccion}
                  helperText={errors.direccion}
                  fullWidth
                />

                <FormControl fullWidth required error={!!errors.estado}>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={formData.estado}
                    label="Estado"
                    onChange={(e) => handleFieldChange('estado', e.target.value)}
                  >
                    <MenuItem value="activo">Activo</MenuItem>
                    <MenuItem value="inactivo">Inactivo</MenuItem>
                  </Select>
                  {errors.estado && (
                    <Typography color="error" variant="caption">
                      {errors.estado}
                    </Typography>
                  )}
                </FormControl>

                {editingCliente && editingCliente.ventas && editingCliente.ventas.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>Historial de Ventas</Typography>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Estado</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {editingCliente.ventas
                            .filter(v => v.estado === 'completada' || v.estado === 'pendiente')
                            .map((venta) => (
                              <TableRow key={venta._id}>
                                <TableCell>{new Date(venta.fecha).toLocaleDateString()}</TableCell>
                                <TableCell>Q{Number(venta.total).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                <TableCell>
                                  <Typography
                                    color={
                                      venta.estado === 'completada' ? 'success.main' :
                                        venta.estado === 'pendiente' ? 'warning.main' :
                                          'error.main'
                                    }
                                  >
                                    {venta.estado ? venta.estado.charAt(0).toUpperCase() + venta.estado.slice(1) : ''}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                      <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
                        <Typography variant="subtitle2">Ventas Completadas</Typography>
                        <Typography variant="h6" color="success.main">
                          Q{calcularEstadisticasCliente(editingCliente).totalIngresos.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Typography>
                      </Paper>
                      <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
                        <Typography variant="subtitle2">Ventas Pendientes</Typography>
                        <Typography variant="h6" color="warning.main">
                          Q{calcularEstadisticasCliente(editingCliente).totalPendientes.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="submit" variant="contained" color="primary">
                {editingCliente ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Clientes; 