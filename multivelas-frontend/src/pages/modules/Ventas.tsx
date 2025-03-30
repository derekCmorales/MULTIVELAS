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
    estado: 'completada'
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
    const totalVentas = ventasCompletadas.length;
    const totalIngresos = ventasCompletadas.reduce((sum, v) => sum + v.total, 0);

    return {
      totalVentas,
      totalIngresos
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

  const handleProductoChange = (index: number, field: string, value: any) => {
    console.log('Cambio de producto:', index, field, value);
    const newProductos = [...formData.productos];
    newProductos[index] = {
      ...newProductos[index],
      [field]: value
    };

    // Si se cambia el producto, actualizar el precio unitario
    if (field === 'producto') {
      const productoSeleccionado = productos.find(p => p._id === value);
      if (productoSeleccionado) {
        newProductos[index].precioUnitario = productoSeleccionado.precio;
      }
    }

    // Calcular el subtotal para este producto
    const cantidad = Number(newProductos[index].cantidad) || 0;
    const precio = Number(newProductos[index].precioUnitario) || 0;
    newProductos[index].subtotal = cantidad * precio;

    // Calcular el total
    const total = newProductos.reduce((sum, p) => sum + (Number(p.subtotal) || 0), 0);

    setFormData({ 
      ...formData, 
      productos: newProductos,
      total: total.toString()
    });

    // Marcar el campo como tocado
    setTouched(prev => {
      console.log('Estado anterior de touched:', prev);
      const newTouched = {
        ...prev,
        productos: prev.productos?.map((p, i) => 
          i === index ? { ...p, [field]: true } : p
        ) || [{ [field]: true }]
      };
      console.log('Nuevo estado de touched:', newTouched);
      return newTouched;
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
        estado: 'completada'
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
      estado: 'completada'
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
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Total de Ventas</Typography>
              <Typography variant="h4">{calcularEstadisticas().totalVentas}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Ingresos Totales</Typography>
              <Typography variant="h4">
                Q{calcularEstadisticas().totalIngresos.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                    {typeof venta.cliente === 'object' ? venta.cliente.nombre : venta.cliente}
                  </TableCell>
                  <TableCell>Q{Number(venta.total).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell>{venta.metodoPago}</TableCell>
                  <TableCell>{venta.estado}</TableCell>
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

                {formData.productos.map((producto, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <FormControl fullWidth required error={!!getProductoError(index, 'producto') && getProductoTouched(index, 'producto')}>
                      <InputLabel>Producto</InputLabel>
                      <Select
                        value={producto.producto}
                        label="Producto"
                        onChange={(e) => handleProductoChange(index, 'producto', e.target.value)}
                      >
                        {productos.map((p) => (
                          <MenuItem key={p._id} value={p._id}>
                            {p.nombre} - Stock: {p.stock}
                          </MenuItem>
                        ))}
                      </Select>
                      {getProductoError(index, 'producto') && getProductoTouched(index, 'producto') && (
                        <Typography color="error" variant="caption">
                          {getProductoError(index, 'producto')}
                        </Typography>
                      )}
                    </FormControl>

                    <TextField
                      label="Cantidad"
                      type="number"
                      value={producto.cantidad}
                      onChange={(e) => handleProductoChange(index, 'cantidad', parseInt(e.target.value))}
                      error={!!getProductoError(index, 'cantidad') && getProductoTouched(index, 'cantidad')}
                      helperText={getProductoError(index, 'cantidad') && getProductoTouched(index, 'cantidad') ? getProductoError(index, 'cantidad') : ''}
                      sx={{ width: '150px' }}
                    />

                    <TextField
                      label="Precio Unitario"
                      type="number"
                      value={producto.precioUnitario}
                      onChange={(e) => handleProductoChange(index, 'precioUnitario', parseFloat(e.target.value))}
                      error={!!getProductoError(index, 'precioUnitario') && getProductoTouched(index, 'precioUnitario')}
                      helperText={getProductoError(index, 'precioUnitario') && getProductoTouched(index, 'precioUnitario') ? getProductoError(index, 'precioUnitario') : ''}
                      InputProps={{
                        startAdornment: 'Q'
                      }}
                      sx={{ width: '150px' }}
                    />

                    {index > 0 && (
                      <IconButton
                        color="error"
                        onClick={() => {
                          const newProductos = formData.productos.filter((_, i) => i !== index);
                          setFormData({ ...formData, productos: newProductos });
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}

                <Button
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setFormData({
                      ...formData,
                      productos: [...formData.productos, { producto: '', cantidad: 1, precioUnitario: 0, subtotal: 0 }]
                    });
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
                    <Typography color="error" variant="caption">
                      {errors.metodoPago}
                    </Typography>
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