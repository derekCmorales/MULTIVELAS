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

interface ProductoVenta {
  producto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface Cliente {
  _id: string;
  nombre: string;
  email: string;
}

interface Venta {
  _id: string;
  cliente: string | Cliente;
  productos: ProductoVenta[];
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
    cliente: '' as string,
    productos: [{ producto: '', cantidad: 1, precioUnitario: 0, subtotal: 0 }],
    total: '0',
    metodoPago: 'efectivo',
    estado: 'pendiente'
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

  // Calcular estadísticas
  const calcularEstadisticas = () => {
    const ventasCompletadas = ventas.filter(v => v.estado === 'completada');
    const ventasPendientes = ventas.filter(v => v.estado === 'pendiente');
    const totalVentas = ventasCompletadas.length;
    const totalIngresos = ventasCompletadas.reduce((sum, v) => sum + v.total, 0);
    const totalPendientes = ventasPendientes.reduce((sum, v) => sum + v.total, 0);

    return {
      totalVentas,
      totalIngresos,
      totalPendientes
    };
  };

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

  const handleFieldChange = (field: string, value: any) => {
    console.log('Cambio de campo:', field, value);
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleProductChange = (index: number, field: string, value: any) => {
    const newProductos = [...formData.productos];
    const producto = { ...newProductos[index] };

    if (field === 'producto') {
      const selectedProduct = productos.find(p => p._id === value);
      if (selectedProduct) {
        producto.producto = value;
        producto.precioUnitario = selectedProduct.precio;
        producto.cantidad = 1;
        producto.subtotal = selectedProduct.precio;
      }
    } else if (field === 'cantidad') {
      const selectedProduct = productos.find(p => p._id === producto.producto);
      if (selectedProduct) {
        if (Number(value) > selectedProduct.stock) {
          toast.error(`Solo hay ${selectedProduct.stock} unidades disponibles`);
          return;
        }
        producto.cantidad = Number(value);
        producto.subtotal = producto.precioUnitario * Number(value);
      }
    } else if (field === 'precioUnitario') {
      producto.precioUnitario = Number(value);
      producto.subtotal = producto.precioUnitario * producto.cantidad;
    }

    newProductos[index] = producto;
    setFormData(prev => ({
      ...prev,
      productos: newProductos,
      total: newProductos.reduce((sum, p) => sum + p.subtotal, 0).toString()
    }));
  };

  const handleAddProduct = () => {
    setFormData(prev => ({
      ...prev,
      productos: [...prev.productos, { producto: '', cantidad: 1, precioUnitario: 0, subtotal: 0 }]
    }));
  };

  const handleRemoveProduct = (index: number) => {
    setFormData(prev => {
      const newProductos = prev.productos.filter((_, i) => i !== index);
      return {
        ...prev,
        productos: newProductos,
        total: newProductos.reduce((sum, p) => sum + p.subtotal, 0).toString()
      };
    });
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.cliente) {
      newErrors.cliente = 'Cliente es requerido';
    }

    if (!formData.productos || formData.productos.length === 0) {
      newErrors.productos = [{ producto: 'Debe agregar al menos un producto' }];
    } else {
      newErrors.productos = formData.productos.map((producto, index) => {
        const productoErrors: { producto?: string; cantidad?: string; precioUnitario?: string } = {};

        // Validar producto
        if (!producto.producto) {
          productoErrors.producto = 'Producto es requerido';
        }

        // Validar cantidad
        if (!producto.cantidad || producto.cantidad <= 0) {
          productoErrors.cantidad = 'Cantidad debe ser mayor a 0';
        }

        // Validar precio unitario
        if (!producto.precioUnitario || producto.precioUnitario <= 0) {
          productoErrors.precioUnitario = 'Precio debe ser mayor a 0';
        }

        // Validar stock disponible
        const productoSeleccionado = productos.find(p => p._id === producto.producto);
        if (productoSeleccionado && producto.cantidad > productoSeleccionado.stock) {
          productoErrors.cantidad = `Solo hay ${productoSeleccionado.stock} unidades disponibles`;
        }

        return productoErrors;
      });
    }

    if (!formData.metodoPago) {
      newErrors.metodoPago = 'Método de pago es requerido';
    }

    console.log('Errores de validación:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Iniciando handleSubmit');
    console.log('Estado actual del formulario:', formData);

    try {
      // Validar el formulario
      const newErrors: typeof errors = {};

      if (!formData.cliente) {
        newErrors.cliente = 'Cliente es requerido';
      }

      if (!formData.productos || formData.productos.length === 0) {
        newErrors.productos = [{ producto: 'Debe agregar al menos un producto' }];
      } else {
        newErrors.productos = formData.productos.map((producto, index) => {
          const productoErrors: { producto?: string; cantidad?: string; precioUnitario?: string } = {};

          // Validar que se haya seleccionado un producto
          if (!producto.producto) {
            productoErrors.producto = 'Debe seleccionar un producto';
          }

          // Validar cantidad
          if (!producto.cantidad || producto.cantidad <= 0) {
            productoErrors.cantidad = 'La cantidad debe ser mayor a 0';
          }

          // Validar precio unitario
          if (!producto.precioUnitario || producto.precioUnitario <= 0) {
            productoErrors.precioUnitario = 'El precio debe ser mayor a 0';
          }

          // Validar stock disponible
          const productoSeleccionado = productos.find(p => p._id === producto.producto);
          if (productoSeleccionado && producto.cantidad > productoSeleccionado.stock) {
            productoErrors.cantidad = `Solo hay ${productoSeleccionado.stock} unidades disponibles`;
          }

          return productoErrors;
        });
      }

      if (!formData.metodoPago) {
        newErrors.metodoPago = 'Método de pago es requerido';
      }

      console.log('Errores de validación:', newErrors);
      setErrors(newErrors);

      // Verificar si hay errores en los productos
      const hasProductErrors = newErrors.productos?.some(p =>
        Object.keys(p).length > 0
      );

      // Si hay errores, no continuar
      if (newErrors.cliente || hasProductErrors || newErrors.metodoPago) {
        console.log('Validación fallida');
        console.log('Errores:', newErrors);
        return;
      }

      const token = localStorage.getItem('token');
      console.log('Token:', token);

      const ventaData = {
        ...formData,
        total: Number(formData.total),
        fecha: new Date().toISOString(),
        productos: formData.productos.map(p => ({
          producto: p.producto,
          cantidad: Number(p.cantidad),
          precioUnitario: Number(p.precioUnitario),
          subtotal: Number(p.subtotal)
        }))
      };

      console.log('Datos a enviar:', ventaData);

      if (editingVenta) {
        console.log('Actualizando venta existente');
        const response = await axios.put<ApiResponse<Venta>>(
          `http://localhost:4000/api/ventas/${editingVenta._id}`,
          ventaData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Respuesta de actualización:', response.data);
        if (response.data.success) {
          toast.success('Venta actualizada correctamente');
          handleClose();
          fetchVentas();
        } else {
          toast.error(response.data.message || 'Error al actualizar venta');
        }
      } else {
        console.log('Creando nueva venta');
        const response = await axios.post<ApiResponse<Venta>>(
          'http://localhost:4000/api/ventas/registro',
          ventaData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Respuesta de creación:', response.data);
        if (response.data.success) {
          toast.success('Venta creada correctamente');
          handleClose();
          fetchVentas();
        } else {
          toast.error(response.data.message || 'Error al crear venta');
        }
      }
    } catch (error: any) {
      console.error('Error completo:', error);
      console.error('Error al guardar venta:', error.message);
      console.error('Respuesta del servidor:', error.response?.data);
      console.error('Configuración de la petición:', error.config);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al guardar venta');
      }
    }
  };

  const handleOpen = (venta?: Venta) => {
    if (venta) {
      setEditingVenta(venta);
      setFormData({
        cliente: typeof venta.cliente === 'string' ? venta.cliente : venta.cliente._id,
        productos: venta.productos.map(p => ({
          producto: p.producto,
          cantidad: p.cantidad,
          precioUnitario: p.precioUnitario,
          subtotal: p.subtotal
        })),
        total: venta.total.toString(),
        metodoPago: venta.metodoPago,
        estado: venta.estado
      });
    } else {
      setEditingVenta(null);
      setFormData({
        cliente: '',
        productos: [{ producto: '', cantidad: 1, precioUnitario: 0, subtotal: 0 }],
        total: '0',
        metodoPago: 'efectivo',
        estado: 'pendiente'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingVenta(null);
    setFormData({
      cliente: '',
      productos: [{ producto: '', cantidad: 1, precioUnitario: 0, subtotal: 0 }],
      total: '0',
      metodoPago: 'efectivo',
      estado: 'pendiente'
    });
    setErrors({});
    setTouched({});
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta venta?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete<ApiResponse<Venta>>(
          `http://localhost:4000/api/ventas/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          toast.success('Venta eliminada correctamente');
          fetchVentas();
        } else {
          toast.error(response.data.message || 'Error al eliminar venta');
        }
      } catch (error: any) {
        console.error('Error al eliminar venta:', error);
        console.error('Respuesta del servidor:', error.response?.data);
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Error al eliminar venta');
        }
      }
    }
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

        {/* Estadísticas */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Total de Ventas Completadas</Typography>
              <Typography variant="h4">{calcularEstadisticas().totalVentas}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Ingresos Totales</Typography>
              <Typography variant="h4" color="success.main">
                Q{calcularEstadisticas().totalIngresos.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Ventas Pendientes</Typography>
              <Typography variant="h4" color="warning.main">
                Q{calcularEstadisticas().totalPendientes.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Método de Pago</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ventas.map((venta) => (
                <TableRow key={venta._id}>
                  <TableCell>{new Date(venta.fecha).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {venta.cliente ?
                      (typeof venta.cliente === 'object' ? venta.cliente.nombre : venta.cliente)
                      : 'Cliente no especificado'}
                  </TableCell>
                  <TableCell>Q{Number(venta.total).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell>{venta.metodoPago.charAt(0).toUpperCase() + venta.metodoPago.slice(1)}</TableCell>
                  <TableCell>
                    <Typography
                      color={
                        venta.estado === 'completada' ? 'success.main' :
                          venta.estado === 'pendiente' ? 'warning.main' :
                            'error.main'
                      }
                    >
                      {venta.estado.charAt(0).toUpperCase() + venta.estado.slice(1)}
                    </Typography>
                  </TableCell>
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
                    value={formData.cliente || ''}
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
                    <Typography color="error" variant="caption">
                      {errors.cliente}
                    </Typography>
                  )}
                </FormControl>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>Productos</Typography>
                  {formData.productos.map((producto, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <FormControl fullWidth error={!!errors.productos?.[index]?.producto}>
                        <InputLabel>Producto</InputLabel>
                        <Select
                          value={producto.producto || ''}
                          label="Producto"
                          onChange={(e) => handleProductChange(index, 'producto', e.target.value)}
                        >
                          {productos.map((p) => (
                            <MenuItem key={p._id} value={p._id}>
                              {p.nombre} - Stock: {p.stock}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.productos?.[index]?.producto && (
                          <Typography color="error" variant="caption">
                            {errors.productos[index].producto}
                          </Typography>
                        )}
                      </FormControl>

                      <TextField
                        label="Cantidad"
                        type="number"
                        value={producto.cantidad}
                        onChange={(e) => handleProductChange(index, 'cantidad', e.target.value)}
                        error={!!errors.productos?.[index]?.cantidad}
                        helperText={errors.productos?.[index]?.cantidad}
                        sx={{ width: '120px' }}
                      />

                      <TextField
                        label="Precio Unitario"
                        type="number"
                        value={producto.precioUnitario}
                        onChange={(e) => handleProductChange(index, 'precioUnitario', e.target.value)}
                        error={!!errors.productos?.[index]?.precioUnitario}
                        helperText={errors.productos?.[index]?.precioUnitario}
                        sx={{ width: '150px' }}
                      />

                      <TextField
                        label="Subtotal"
                        value={producto.subtotal}
                        InputProps={{ readOnly: true }}
                        sx={{ width: '150px' }}
                      />

                      <IconButton onClick={() => handleRemoveProduct(index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddProduct}
                    sx={{ mt: 1 }}
                  >
                    Agregar Producto
                  </Button>
                </Box>

                <TextField
                  label="Total"
                  value={formData.total}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />

                <FormControl fullWidth required error={!!errors.metodoPago}>
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
                  {errors.metodoPago && (
                    <Typography color="error" variant="caption">
                      {errors.metodoPago}
                    </Typography>
                  )}
                </FormControl>

                <FormControl fullWidth required>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={formData.estado}
                    label="Estado"
                    onChange={(e) => handleFieldChange('estado', e.target.value)}
                  >
                    <MenuItem value="pendiente">Pendiente</MenuItem>
                    <MenuItem value="completada">Completada</MenuItem>
                    <MenuItem value="cancelada">Cancelada</MenuItem>
                  </Select>
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