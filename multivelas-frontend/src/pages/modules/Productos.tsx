import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  AppBar,
  Toolbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ApiResponse } from '../../types/api';

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
  const [productos, setProductos] = useState<Producto[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: '',
    estado: 'activo'
  });
  const [errors, setErrors] = useState<{
    nombre?: string;
    descripcion?: string;
    precio?: string;
    stock?: string;
    categoria?: string;
    estado?: string;
  }>({});
  const navigate = useNavigate();

  const cargarProductos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<ApiResponse<Producto[]>>('http://localhost:4000/api/productos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setProductos(response.data.data);
      } else {
        toast.error('Error al cargar los productos');
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
      toast.error('Error al cargar los productos');
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.nombre) newErrors.nombre = 'El nombre es requerido';
    if (!formData.descripcion) newErrors.descripcion = 'La descripción es requerida';
    if (!formData.precio || parseFloat(formData.precio) <= 0) newErrors.precio = 'El precio debe ser mayor a 0';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'El stock no puede ser negativo';
    if (!formData.categoria) newErrors.categoria = 'La categoría es requerida';
    if (!formData.estado) newErrors.estado = 'El estado es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpen = (producto?: Producto) => {
    if (producto) {
      setSelectedProducto(producto);
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio.toString(),
        stock: producto.stock.toString(),
        categoria: producto.categoria,
        estado: producto.estado
      });
    } else {
      setSelectedProducto(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria: '',
        estado: 'activo'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProducto(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      categoria: '',
      estado: 'activo'
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!validateForm()) {
        toast.error('Por favor, complete todos los campos requeridos');
        return;
      }

      const token = localStorage.getItem('token');
      const productoData = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock)
      };

      if (selectedProducto) {
        const response = await axios.put<ApiResponse<Producto>>(
          `http://localhost:4000/api/productos/${selectedProducto._id}`,
          productoData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          toast.success('Producto actualizado exitosamente');
          cargarProductos();
          handleClose();
        } else {
          toast.error(response.data.message || 'Error al actualizar el producto');
        }
      } else {
        const response = await axios.post<ApiResponse<Producto>>(
          'http://localhost:4000/api/productos',
          productoData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          toast.success('Producto creado exitosamente');
          cargarProductos();
          handleClose();
        } else {
          toast.error(response.data.message || 'Error al crear el producto');
        }
      }
    } catch (error) {
      console.error('Error al guardar producto:', error);
      toast.error('Error al guardar el producto');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete<ApiResponse<void>>(
          `http://localhost:4000/api/productos/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          toast.success('Producto eliminado exitosamente');
          cargarProductos();
        } else {
          toast.error(response.data.message || 'Error al eliminar el producto');
        }
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        toast.error('Error al eliminar el producto');
      }
    }
  };

  return (
    <Box>
      <AppBar position="static" color="default">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MultiVelas
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Nuevo Producto
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <TableContainer component={Paper}>
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
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProducto ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                error={!!errors.nombre}
                helperText={errors.nombre}
                fullWidth
                required
              />
              <TextField
                label="Descripción"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                error={!!errors.descripcion}
                helperText={errors.descripcion}
                fullWidth
                required
                multiline
                rows={3}
              />
              <TextField
                label="Precio"
                type="number"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                error={!!errors.precio}
                helperText={errors.precio}
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
                error={!!errors.stock}
                helperText={errors.stock}
                fullWidth
                required
              />
              <FormControl fullWidth required error={!!errors.categoria}>
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
                {errors.categoria && (
                  <Typography color="error" variant="caption">
                    {errors.categoria}
                  </Typography>
                )}
              </FormControl>
              <FormControl fullWidth required error={!!errors.estado}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.estado}
                  label="Estado"
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
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
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedProducto ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Productos; 