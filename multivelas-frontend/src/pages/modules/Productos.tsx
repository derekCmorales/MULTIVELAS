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

interface Producto {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  estado: string;
}

const Productos: React.FC = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [open, setOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: '',
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<ApiResponse<Producto[]>>('http://localhost:4000/api/productos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setProductos(response.data.data);
      } else {
        console.error('Error en la respuesta:', response.data.message);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const handleOpen = (producto?: Producto) => {
    if (producto) {
      setProductoSeleccionado(producto);
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio.toString(),
        stock: producto.stock.toString(),
        categoria: producto.categoria,
      });
    } else {
      setProductoSeleccionado(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setProductoSeleccionado(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validar campos requeridos
      if (!formData.nombre || !formData.precio || !formData.stock || !formData.categoria) {
        toast.error('Todos los campos son requeridos');
        return;
      }

      const token = localStorage.getItem('token');
      const productoData = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        estado: 'activo'
      };

      if (productoSeleccionado) {
        const response = await axios.put<ApiResponse<Producto>>(
          `http://localhost:4000/api/productos/${productoSeleccionado._id}`,
          productoData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          toast.success('Producto actualizado correctamente');
          handleClose();
          cargarProductos();
        } else {
          toast.error(response.data.message || 'Error al actualizar producto');
        }
      } else {
        const response = await axios.post<ApiResponse<Producto>>(
          'http://localhost:4000/api/productos',
          productoData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          toast.success('Producto creado correctamente');
          handleClose();
          cargarProductos();
        } else {
          toast.error(response.data.message || 'Error al crear producto');
        }
      }
    } catch (error) {
      console.error('Error al guardar producto:', error);
      toast.error('Error al guardar producto');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:4000/api/productos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        cargarProductos();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
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
            <Typography variant="h4">Gestión de Productos</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Nuevo Producto
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.map((producto) => (
                  <TableRow key={producto._id}>
                    <TableCell>{producto.nombre}</TableCell>
                    <TableCell>{producto.descripcion}</TableCell>
                    <TableCell>Q{producto.precio.toFixed(2)}</TableCell>
                    <TableCell>{producto.stock}</TableCell>
                    <TableCell>{producto.categoria}</TableCell>
                    <TableCell>{producto.estado}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpen(producto)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(producto._id)} color="error">
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
            {productoSeleccionado ? 'Editar Producto' : 'Nuevo Producto'}
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
                  label="Descripción"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  fullWidth
                  multiline
                  rows={3}
                />
                <TextField
                  label="Precio"
                  type="number"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: 'Q'
                  }}
                />
                <TextField
                  label="Stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  fullWidth
                  required
                />
                <FormControl fullWidth required>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={formData.categoria}
                    label="Categoría"
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  >
                    <MenuItem value="velas">Velas</MenuItem>
                    <MenuItem value="aromatizantes">Aromatizantes</MenuItem>
                    <MenuItem value="accesorios">Accesorios</MenuItem>
                    <MenuItem value="otros">Otros</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="submit" variant="contained">
                {productoSeleccionado ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Productos; 