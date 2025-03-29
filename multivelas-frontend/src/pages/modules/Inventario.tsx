import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
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
  MenuItem,
  IconButton
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
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

const validationSchema = yup.object({
  nombre: yup.string().required('Nombre es requerido'),
  descripcion: yup.string().required('Descripción es requerida'),
  precio: yup.number().required('Precio es requerido').min(0, 'Precio debe ser mayor a 0'),
  stock: yup.number().required('Stock es requerido').min(0, 'Stock debe ser mayor o igual a 0'),
  categoria: yup.string().required('Categoría es requerida'),
  estado: yup.string().required('Estado es requerido')
});

const Inventario: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [open, setOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);

  const fetchProductos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/productos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductos(response.data as Producto[]);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      toast.error('Error al cargar productos');
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const formik = useFormik({
    initialValues: {
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      categoria: '',
      estado: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('token');
        if (editingProducto) {
          await axios.put(
            `http://localhost:4000/api/productos/${editingProducto._id}`,
            values,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success('Producto actualizado correctamente');
        } else {
          await axios.post(
            'http://localhost:4000/api/productos',
            values,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success('Producto creado correctamente');
        }
        handleClose();
        fetchProductos();
      } catch (error) {
        console.error('Error al guardar producto:', error);
        toast.error('Error al guardar producto');
      }
    }
  });

  const handleOpen = (producto?: Producto) => {
    if (producto) {
      setEditingProducto(producto);
      formik.setValues({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio.toString(),
        stock: producto.stock.toString(),
        categoria: producto.categoria,
        estado: producto.estado
      });
    } else {
      setEditingProducto(null);
      formik.resetForm();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProducto(null);
    formik.resetForm();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:4000/api/productos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Producto eliminado correctamente');
        fetchProductos();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        toast.error('Error al eliminar producto');
      }
    }
  };

  const calcularValorTotal = () => {
    return productos.reduce((acc, producto) => acc + (producto.precio * producto.stock), 0);
  };

  const calcularStockTotal = () => {
    return productos.reduce((acc, producto) => acc + producto.stock, 0);
  };

  const calcularProductosBajos = () => {
    return productos.filter(producto => producto.stock < 10).length;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Inventario</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Nuevo Producto
        </Button>
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Valor Total del Inventario
              </Typography>
              <Typography variant="h4" color="primary">
                ${calcularValorTotal().toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Stock Total
              </Typography>
              <Typography variant="h4" color="primary">
                {calcularStockTotal()} unidades
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Productos con Stock Bajo
              </Typography>
              <Typography variant="h4" color="error">
                {calcularProductosBajos()} productos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
                <TableCell>${producto.precio.toFixed(2)}</TableCell>
                <TableCell color={producto.stock < 10 ? 'error.main' : 'inherit'}>
                  {producto.stock}
                </TableCell>
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

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProducto ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="nombre"
                  label="Nombre"
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                  helperText={formik.touched.nombre && formik.errors.nombre}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="descripcion"
                  label="Descripción"
                  value={formik.values.descripcion}
                  onChange={formik.handleChange}
                  error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
                  helperText={formik.touched.descripcion && formik.errors.descripcion}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="precio"
                  label="Precio"
                  type="number"
                  value={formik.values.precio}
                  onChange={formik.handleChange}
                  error={formik.touched.precio && Boolean(formik.errors.precio)}
                  helperText={formik.touched.precio && formik.errors.precio}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="stock"
                  label="Stock"
                  type="number"
                  value={formik.values.stock}
                  onChange={formik.handleChange}
                  error={formik.touched.stock && Boolean(formik.errors.stock)}
                  helperText={formik.touched.stock && formik.errors.stock}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name="categoria"
                  label="Categoría"
                  value={formik.values.categoria}
                  onChange={formik.handleChange}
                  error={formik.touched.categoria && Boolean(formik.errors.categoria)}
                  helperText={formik.touched.categoria && formik.errors.categoria}
                >
                  <MenuItem value="velas">Velas</MenuItem>
                  <MenuItem value="aromatizantes">Aromatizantes</MenuItem>
                  <MenuItem value="accesorios">Accesorios</MenuItem>
                  <MenuItem value="otros">Otros</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name="estado"
                  label="Estado"
                  value={formik.values.estado}
                  onChange={formik.handleChange}
                  error={formik.touched.estado && Boolean(formik.errors.estado)}
                  helperText={formik.touched.estado && formik.errors.estado}
                >
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="inactivo">Inactivo</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingProducto ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Inventario; 