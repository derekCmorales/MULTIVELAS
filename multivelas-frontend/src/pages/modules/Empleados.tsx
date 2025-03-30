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

interface Empleado {
  _id: string;
  nombre: string;
  email: string;
  password?: string;
  telefono: string;
  direccion: string;
  salario: number;
  rol: string;
  estado: string;
  fechaContratacion: string;
}

interface EmpleadoResponse {
  mensaje: string;
  empleado?: Empleado;
}

const Empleados: React.FC = () => {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [open, setOpen] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<Empleado | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    direccion: '',
    salario: '0',
    rol: '',
    estado: 'activo',
    fechaContratacion: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<Empleado[]>('http://localhost:4000/api/empleados', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmpleados(response.data);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
      toast.error('Error al cargar empleados');
    }
  };

  const handleOpen = (empleado?: Empleado) => {
    if (empleado) {
      setEditingEmpleado(empleado);
      setFormData({
        nombre: empleado.nombre,
        email: empleado.email,
        password: '',
        telefono: empleado.telefono,
        direccion: empleado.direccion,
        salario: empleado.salario.toString(),
        rol: empleado.rol,
        estado: empleado.estado,
        fechaContratacion: empleado.fechaContratacion.split('T')[0]
      });
    } else {
      setEditingEmpleado(null);
      setFormData({
        nombre: '',
        email: '',
        password: '',
        telefono: '',
        direccion: '',
        salario: '0',
        rol: '',
        estado: 'activo',
        fechaContratacion: new Date().toISOString().split('T')[0]
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingEmpleado(null);
    setFormData({
      nombre: '',
      email: '',
      password: '',
      telefono: '',
      direccion: '',
      salario: '0',
      rol: '',
      estado: 'activo',
      fechaContratacion: new Date().toISOString().split('T')[0]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!editingEmpleado && formData.password.length < 6) {
        toast.error('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      const token = localStorage.getItem('token');
      const empleadoData = {
        ...formData,
        salario: Number(formData.salario),
        estado: 'activo'
      };

      console.log('Datos a enviar:', empleadoData);

      if (editingEmpleado) {
        const response = await axios.put<EmpleadoResponse>(
          `http://localhost:4000/api/empleados/${editingEmpleado._id}`,
          empleadoData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.empleado) {
          toast.success('Empleado actualizado correctamente');
          handleClose();
          cargarEmpleados();
        } else {
          toast.error(response.data.mensaje || 'Error al actualizar empleado');
        }
      } else {
        const response = await axios.post<EmpleadoResponse>(
          'http://localhost:4000/api/empleados/registro',
          empleadoData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.empleado) {
          toast.success('Empleado creado correctamente');
          handleClose();
          cargarEmpleados();
        } else {
          toast.error(response.data.mensaje || 'Error al crear empleado');
        }
      }
    } catch (error: any) {
      console.error('Error al guardar empleado:', error);
      console.error('Respuesta del servidor:', error.response?.data);
      
      // Manejar específicamente el error de email duplicado
      if (error.response?.data?.error?.includes('duplicate key error') && error.response?.data?.error?.includes('email')) {
        toast.error('Este email ya está registrado. Por favor, use otro email.');
      } else {
        toast.error(error.response?.data?.mensaje || 'Error al guardar empleado');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este empleado?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete<EmpleadoResponse>(`http://localhost:4000/api/empleados/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.mensaje) {
          toast.success('Empleado eliminado correctamente');
          cargarEmpleados();
        } else {
          toast.error(response.data.mensaje || 'Error al eliminar empleado');
        }
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
        toast.error('Error al eliminar empleado');
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
            <Typography variant="h4">Gestión de Empleados</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Nuevo Empleado
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Salario</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {empleados.map((empleado) => (
                  <TableRow key={empleado._id}>
                    <TableCell>{empleado.nombre}</TableCell>
                    <TableCell>{empleado.email}</TableCell>
                    <TableCell>{empleado.rol}</TableCell>
                    <TableCell>Q{empleado.salario.toFixed(2)}</TableCell>
                    <TableCell>{empleado.estado}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpen(empleado)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(empleado._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'}
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
                {!editingEmpleado && (
                  <TextField
                    label="Contraseña"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    fullWidth
                    required
                    helperText="Mínimo 6 caracteres"
                  />
                )}
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
                  multiline
                  rows={3}
                />
                <FormControl fullWidth required>
                  <InputLabel>Rol</InputLabel>
                  <Select
                    value={formData.rol}
                    label="Rol"
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  >
                    <MenuItem value="admin">Administrador</MenuItem>
                    <MenuItem value="vendedor">Vendedor</MenuItem>
                    <MenuItem value="inventario">Inventario</MenuItem>
                    <MenuItem value="financiero">Financiero</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Salario"
                  type="number"
                  value={formData.salario}
                  onChange={(e) => setFormData({ ...formData, salario: e.target.value })}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: 'Q'
                  }}
                />
                <TextField
                  label="Fecha de Contratación"
                  type="date"
                  value={formData.fechaContratacion}
                  onChange={(e) => setFormData({ ...formData, fechaContratacion: e.target.value })}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="submit" variant="contained" color="primary">
                {editingEmpleado ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Empleados; 