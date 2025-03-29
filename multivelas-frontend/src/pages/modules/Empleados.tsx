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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

interface Empleado {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  salario: number;
  fechaContratacion: string;
  estado: string;
}

const Empleados: React.FC = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [open, setOpen] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: '',
    salario: '',
    fechaContratacion: '',
  });

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/empleados', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmpleados(response.data as Empleado[]);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    }
  };

  const handleOpen = (empleado?: Empleado) => {
    if (empleado) {
      setEmpleadoSeleccionado(empleado);
      setFormData({
        nombre: empleado.nombre,
        email: empleado.email,
        password: '',
        rol: empleado.rol,
        salario: empleado.salario.toString(),
        fechaContratacion: empleado.fechaContratacion.split('T')[0],
      });
    } else {
      setEmpleadoSeleccionado(null);
      setFormData({
        nombre: '',
        email: '',
        password: '',
        rol: '',
        salario: '',
        fechaContratacion: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEmpleadoSeleccionado(null);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const empleadoData = {
        ...formData,
        salario: parseFloat(formData.salario),
      };

      if (empleadoSeleccionado) {
        await axios.put(
          `http://localhost:4000/api/empleados/${empleadoSeleccionado.id}`,
          empleadoData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:4000/api/empleados/registro',
          empleadoData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      handleClose();
      cargarEmpleados();
    } catch (error) {
      console.error('Error al guardar empleado:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este empleado?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:4000/api/empleados/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        cargarEmpleados();
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
      }
    }
  };

  return (
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
                <TableCell>Fecha Contratación</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {empleados.map((empleado) => (
                <TableRow key={empleado.id}>
                  <TableCell>{empleado.nombre}</TableCell>
                  <TableCell>{empleado.email}</TableCell>
                  <TableCell>{empleado.rol}</TableCell>
                  <TableCell>${empleado.salario.toFixed(2)}</TableCell>
                  <TableCell>{new Date(empleado.fechaContratacion).toLocaleDateString()}</TableCell>
                  <TableCell>{empleado.estado}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(empleado)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(empleado.id)}>
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
          {empleadoSeleccionado ? 'Editar Empleado' : 'Nuevo Empleado'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
            />
            {!empleadoSeleccionado && (
              <TextField
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                fullWidth
              />
            )}
            <FormControl fullWidth>
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
            />
            <TextField
              label="Fecha de Contratación"
              type="date"
              value={formData.fechaContratacion}
              onChange={(e) => setFormData({ ...formData, fechaContratacion: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {empleadoSeleccionado ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Empleados; 