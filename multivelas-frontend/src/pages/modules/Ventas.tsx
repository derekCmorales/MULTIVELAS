import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Remove as RemoveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ApiResponse } from '../../types/api';

interface Venta {
  _id: string;
  cliente: {
    _id: string;
    nombre: string;
  };
  vendedor: {
    _id: string;
    nombre: string;
  };
  productos: Array<{
    producto: {
      _id: string;
      nombre: string;
      precio: number;
    };
    cantidad: number;
    precioUnitario: number;
  }>;
  total: number;
  fecha: string;
  metodoPago: string;
  estado: string;
}

const validationSchema = yup.object({
  cliente: yup.string().required('Cliente es requerido'),
  productos: yup.array().of(
    yup.object().shape({
      producto: yup.string().required('Producto es requerido'),
      cantidad: yup.number().required('Cantidad es requerida').min(1, 'Cantidad debe ser mayor a 0'),
      precioUnitario: yup.number().required('Precio unitario es requerido').min(0, 'Precio debe ser mayor o igual a 0')
    })
  ),
  metodoPago: yup.string().required('Método de pago es requerido')
});

const Ventas: React.FC = () => {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [open, setOpen] = useState(false);
  const [clientes, setClientes] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [editingVenta, setEditingVenta] = useState<Venta | null>(null);
  const [formData, setFormData] = useState({
    cliente: '',
    productos: [{ producto: '', cantidad: 1, precioUnitario: 0 }],
    metodoPago: ''
  });
  const [errors, setErrors] = useState<{
    cliente?: string;
    productos?: Array<{
      producto?: string;
      cantidad?: string;
      precioUnitario?: string;
    }>;
    metodoPago?: string;
  }>({});
  const [touched, setTouched] = useState<{
    cliente?: boolean;
    productos?: Array<{
      producto?: boolean;
      cantidad?: boolean;
      precioUnitario?: boolean;
    }>;
    metodoPago?: boolean;
  }>({});

  const fetchVentas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<ApiResponse<Venta[]>>('http://localhost:4000/api/ventas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setVentas(response.data.data);
      } else {
        console.error('Error en la respuesta:', response.data.message);
        toast.error('Error al cargar ventas');
      }
    } catch (error) {
      console.error('Error al cargar ventas:', error);
      toast.error('Error al cargar ventas');
    }
  };

  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<ApiResponse<any[]>>('http://localhost:4000/api/clientes', {
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

  const fetchProductos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<ApiResponse<any[]>>('http://localhost:4000/api/productos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setProductos(response.data.data);
      } else {
        console.error('Error en la respuesta:', response.data.message);
        toast.error('Error al cargar productos');
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
      toast.error('Error al cargar productos');
    }
  };

  useEffect(() => {
    fetchVentas();
    fetchClientes();
    fetchProductos();
  }, []);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.cliente) {
      newErrors.cliente = 'Cliente es requerido';
    }

    if (!formData.productos || formData.productos.length === 0) {
      newErrors.productos = [{ producto: 'Debe agregar al menos un producto' }];
    } else {
      newErrors.productos = formData.productos.map(producto => {
        const productoErrors: { producto?: string; cantidad?: string; precioUnitario?: string } = {};
        if (!producto.producto) productoErrors.producto = 'Producto es requerido';
        if (!producto.cantidad || producto.cantidad <= 0) productoErrors.cantidad = 'Cantidad debe ser mayor a 0';
        if (!producto.precioUnitario || producto.precioUnitario <= 0) productoErrors.precioUnitario = 'Precio debe ser mayor a 0';
        return productoErrors;
      });
    }

    if (!formData.metodoPago) {
      newErrors.metodoPago = 'Método de pago es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!validateForm()) {
        toast.error('Por favor, complete todos los campos requeridos');
        return;
      }

      const token = localStorage.getItem('token');
      const ventaData = {
        ...formData,
        estado: 'completada',
        vendedor: localStorage.getItem('userId')
      };

      if (editingVenta) {
        const response = await axios.put<ApiResponse<Venta>>(
          `http://localhost:4000/api/ventas/${editingVenta._id}`,
          ventaData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          toast.success('Venta actualizada correctamente');
          handleClose();
          fetchVentas();
        } else {
          toast.error(response.data.message || 'Error al actualizar venta');
        }
      } else {
        const response = await axios.post<ApiResponse<Venta>>(
          'http://localhost:4000/api/ventas',
          ventaData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          toast.success('Venta creada correctamente');
          handleClose();
          fetchVentas();
        } else {
          toast.error(response.data.message || 'Error al crear venta');
        }
      }
    } catch (error) {
      console.error('Error al guardar venta:', error);
      toast.error('Error al guardar venta');
    }
  };

  const handleOpen = (venta?: Venta) => {
    if (venta) {
      setEditingVenta(venta);
      setFormData({
        cliente: venta.cliente._id,
        productos: venta.productos.map(p => ({
          producto: p.producto._id,
          cantidad: p.cantidad,
          precioUnitario: p.precioUnitario
        })),
        metodoPago: venta.metodoPago
      });
    } else {
      setEditingVenta(null);
      setFormData({
        cliente: '',
        productos: [{ producto: '', cantidad: 1, precioUnitario: 0 }],
        metodoPago: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingVenta(null);
    setFormData({
      cliente: '',
      productos: [{ producto: '', cantidad: 1, precioUnitario: 0 }],
      metodoPago: ''
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta venta?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:4000/api/ventas/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Venta eliminada correctamente');
        fetchVentas();
      } catch (error) {
        console.error('Error al eliminar venta:', error);
        toast.error('Error al eliminar venta');
      }
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleProductoChange = (index: number, field: string, value: any) => {
    const newProductos = [...formData.productos];
    newProductos[index] = { ...newProductos[index], [field]: value };
    setFormData(prev => ({ ...prev, productos: newProductos }));
    setTouched(prev => ({
      ...prev,
      productos: prev.productos?.map((p, i) => 
        i === index ? { ...p, [field]: true } : p
      )
    }));
  };

  const getProductoError = (index: number, field: 'producto' | 'cantidad' | 'precioUnitario') => {
    return errors.productos?.[index]?.[field];
  };

  const getProductoTouched = (index: number, field: 'producto' | 'cantidad' | 'precioUnitario') => {
    return touched.productos?.[index]?.[field];
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Ventas</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Nueva Venta
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Vendedor</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Método de Pago</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ventas.map((venta) => (
                <TableRow key={venta._id}>
                  <TableCell>{new Date(venta.fecha).toLocaleDateString()}</TableCell>
                  <TableCell>{venta.cliente.nombre}</TableCell>
                  <TableCell>{venta.vendedor.nombre}</TableCell>
                  <TableCell>Q{venta.total.toFixed(2)}</TableCell>
                  <TableCell>{venta.estado}</TableCell>
                  <TableCell>{venta.metodoPago}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(venta)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(venta._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingVenta ? 'Editar Venta' : 'Nueva Venta'}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <FormControl fullWidth required error={!!errors.cliente && touched.cliente}>
                  <InputLabel>Cliente</InputLabel>
                  <Select
                    value={formData.cliente}
                    label="Cliente"
                    onChange={(e) => handleFieldChange('cliente', e.target.value)}
                  >
                    {clientes.map((cliente) => (
                      <MenuItem key={cliente._id} value={cliente._id}>
                        {cliente.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.cliente && touched.cliente && (
                    <Typography color="error" variant="caption">{errors.cliente}</Typography>
                  )}
                </FormControl>

                <Typography variant="h6" sx={{ mt: 2 }}>Productos</Typography>
                {formData.productos.map((producto, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth required error={!!getProductoError(index, 'producto') && getProductoTouched(index, 'producto')}>
                        <InputLabel>Producto</InputLabel>
                        <Select
                          value={producto.producto}
                          label="Producto"
                          onChange={(e) => handleProductoChange(index, 'producto', e.target.value)}
                        >
                          {productos.map((p) => (
                            <MenuItem key={p._id} value={p._id}>
                              {p.nombre} - Q{p.precio}
                            </MenuItem>
                          ))}
                        </Select>
                        {getProductoError(index, 'producto') && getProductoTouched(index, 'producto') && (
                          <Typography color="error" variant="caption">{getProductoError(index, 'producto')}</Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Cantidad"
                        type="number"
                        value={producto.cantidad}
                        onChange={(e) => handleProductoChange(index, 'cantidad', Number(e.target.value))}
                        fullWidth
                        required
                        error={!!getProductoError(index, 'cantidad') && getProductoTouched(index, 'cantidad')}
                        helperText={getProductoError(index, 'cantidad') && getProductoTouched(index, 'cantidad') ? getProductoError(index, 'cantidad') : ''}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Precio Unitario"
                        type="number"
                        value={producto.precioUnitario}
                        onChange={(e) => handleProductoChange(index, 'precioUnitario', Number(e.target.value))}
                        fullWidth
                        required
                        error={!!getProductoError(index, 'precioUnitario') && getProductoTouched(index, 'precioUnitario')}
                        helperText={getProductoError(index, 'precioUnitario') && getProductoTouched(index, 'precioUnitario') ? getProductoError(index, 'precioUnitario') : ''}
                        InputProps={{
                          startAdornment: 'Q'
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <IconButton
                        onClick={() => {
                          const newProductos = formData.productos.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, productos: newProductos }));
                        }}
                        disabled={formData.productos.length === 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      productos: [...prev.productos, { producto: '', cantidad: 1, precioUnitario: 0 }]
                    }));
                  }}
                >
                  Agregar Producto
                </Button>

                <FormControl fullWidth required error={!!errors.metodoPago && touched.metodoPago}>
                  <InputLabel>Método de Pago</InputLabel>
                  <Select
                    value={formData.metodoPago}
                    label="Método de Pago"
                    onChange={(e) => handleFieldChange('metodoPago', e.target.value)}
                  >
                    <MenuItem value="efectivo">Efectivo</MenuItem>
                    <MenuItem value="tarjeta">Tarjeta</MenuItem>
                    <MenuItem value="transferencia">Transferencia</MenuItem>
                  </Select>
                  {errors.metodoPago && touched.metodoPago && (
                    <Typography color="error" variant="caption">{errors.metodoPago}</Typography>
                  )}
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="submit" variant="contained" color="primary">
                {editingVenta ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Ventas; 