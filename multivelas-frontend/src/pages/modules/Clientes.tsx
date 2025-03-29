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
  tipoCliente: string;
  estado: string;
}

const Clientes: React.FC = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [open, setOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    tipoCliente: '',
  });

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<ApiResponse<Cliente[]>>('http://localhost:4000/api/clientes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setClientes(response.data.data);
      } else {
        console.error('Error en la respuesta:', response.data.message);
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const handleOpen = (cliente?: Cliente) => {
    if (cliente) {
      setClienteSeleccionado(cliente);
      setFormData({
        nombre: cliente.nombre,
        email: cliente.email,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        tipoCliente: cliente.tipoCliente,
      });
    } else {
      setClienteSeleccionado(null);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        tipoCliente: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setClienteSeleccionado(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validar campos requeridos
      if (!formData.nombre || !formData.email || !formData.telefono || !formData.direccion || !formData.tipoCliente) {
        toast.error('Todos los campos son requeridos');
        return;
      }

      const token = localStorage.getItem('token');
      const clienteData = {
        ...formData,
        estado: 'activo'
      };

      if (clienteSeleccionado) {
        const response = await axios.put<ApiResponse<Cliente>>(
          `http://localhost:4000/api/clientes/${clienteSeleccionado._id}`,
          clienteData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          toast.success('Cliente actualizado correctamente');
          handleClose();
          cargarClientes();
        } else {
          toast.error(response.data.message || 'Error al actualizar cliente');
        }
      } else {
        const response = await axios.post<ApiResponse<Cliente>>(
          'http://localhost:4000/api/clientes',
          clienteData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          toast.success('Cliente creado correctamente');
          handleClose();
          cargarClientes();
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
        await axios.delete(`http://localhost:4000/api/clientes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        cargarClientes();
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
      }
    }
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
                  <TableCell>Tipo</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow key={cliente._id}>
                    <TableCell>{cliente.nombre}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell>{cliente.telefono}</TableCell>
                    <TableCell>{cliente.direccion}</TableCell>
                    <TableCell>{cliente.tipoCliente}</TableCell>
                    <TableCell>{cliente.estado}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpen(cliente)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(cliente._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {clienteSeleccionado ? 'Editar Cliente' : 'Nuevo Cliente'}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  label="Nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  fullWidth
                  required
                />
                <TextField
                  label="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  fullWidth
                  required
                  type="email"
                />
                <TextField
                  label="Teléfono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  fullWidth
                  required
                />
                <TextField
                  label="Dirección"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  fullWidth
                  required
                />
                <FormControl fullWidth required>
                  <InputLabel>Tipo de Cliente</InputLabel>
                  <Select
                    value={formData.tipoCliente}
                    label="Tipo de Cliente"
                    onChange={(e) => setFormData({ ...formData, tipoCliente: e.target.value })}
                  >
                    <MenuItem value="minorista">Minorista</MenuItem>
                    <MenuItem value="mayorista">Mayorista</MenuItem>
                    <MenuItem value="distribuidor">Distribuidor</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="submit" variant="contained">
                {clienteSeleccionado ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Clientes; 