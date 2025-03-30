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
  IconButton,
  AppBar,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ApiResponse } from '../../types/api';

interface Transaccion {
  _id: string;
  tipo: 'ingreso' | 'egreso';
  monto: number | string;
  descripcion: string;
  fecha: string;
  categoria: string;
  metodoPago: string;
  estado: string;
  referencia?: string;
  notas?: string;
}

interface Producto {
  _id: string;
  precio: number;
  stock: number;
}

const categorias = [
  { value: 'ventas', label: 'Ventas' },
  { value: 'salarios', label: 'Salarios' },
  { value: 'inventario', label: 'Inventario' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'otros', label: 'Otros' }
];

const Financiero: React.FC = () => {
  const navigate = useNavigate();
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [open, setOpen] = useState(false);
  const [editingTransaccion, setEditingTransaccion] = useState<Transaccion | null>(null);
  const [formData, setFormData] = useState({
    tipo: 'ingreso',
    monto: '',
    descripcion: '',
    categoria: '',
    metodoPago: 'efectivo',
    estado: 'completado'
  });

  const fetchTransacciones = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<ApiResponse<Transaccion[]>>('http://localhost:4000/api/financiero/transacciones', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        const transaccionesFormateadas = response.data.data.map(t => ({
          ...t,
          monto: typeof t.monto === 'string' ? parseFloat(t.monto.replace(/[^0-9.-]+/g, '')) : t.monto
        }));
        setTransacciones(transaccionesFormateadas);
      } else {
        toast.error('Error al cargar transacciones');
      }
    } catch (error) {
      console.error('Error al cargar transacciones:', error);
      toast.error('Error al cargar transacciones');
    }
  };

  const fetchProductos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<ApiResponse<Producto[]>>('http://localhost:4000/api/productos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setProductos(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  useEffect(() => {
    fetchTransacciones();
    fetchProductos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const transaccionData = {
        ...formData,
        monto: Number(formData.monto),
        fecha: new Date().toISOString()
      };

      if (editingTransaccion) {
        const response = await axios.put<ApiResponse<Transaccion>>(
          `http://localhost:4000/api/financiero/transacciones/${editingTransaccion._id}`,
          transaccionData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          toast.success('Transacción actualizada correctamente');
          handleClose();
          fetchTransacciones();
        } else {
          toast.error(response.data.message || 'Error al actualizar transacción');
        }
      } else {
        const response = await axios.post<ApiResponse<Transaccion>>(
          'http://localhost:4000/api/financiero/transacciones',
          transaccionData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          toast.success('Transacción creada correctamente');
          handleClose();
          fetchTransacciones();
        } else {
          toast.error(response.data.message || 'Error al crear transacción');
        }
      }
    } catch (error) {
      console.error('Error al guardar transacción:', error);
      toast.error('Error al guardar transacción');
    }
  };

  const handleOpen = (transaccion?: Transaccion) => {
    if (transaccion) {
      setEditingTransaccion(transaccion);
      setFormData({
        tipo: transaccion.tipo,
        monto: transaccion.monto.toString(),
        descripcion: transaccion.descripcion,
        categoria: transaccion.categoria,
        metodoPago: transaccion.metodoPago,
        estado: transaccion.estado
      });
    } else {
      setEditingTransaccion(null);
      setFormData({
        tipo: 'ingreso',
        monto: '0',
        descripcion: '',
        categoria: '',
        metodoPago: 'efectivo',
        estado: 'completado'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTransaccion(null);
    setFormData({
      tipo: 'ingreso',
      monto: '0',
      descripcion: '',
      categoria: '',
      metodoPago: 'efectivo',
      estado: 'completado'
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta transacción?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete<ApiResponse<void>>(`http://localhost:4000/api/financiero/transacciones/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          toast.success('Transacción eliminada correctamente');
          fetchTransacciones();
        } else {
          toast.error(response.data.message || 'Error al eliminar transacción');
        }
      } catch (error) {
        console.error('Error al eliminar transacción:', error);
        toast.error('Error al eliminar transacción');
      }
    }
  };

  const calcularBalance = () => {
    if (!transacciones || transacciones.length === 0) return 0;
    const balance = transacciones.reduce((acc, transaccion) => {
      const monto = Number(transaccion.monto);
      return acc + (transaccion.tipo === 'ingreso' ? monto : -monto);
    }, 0);
    return Number(balance) || 0;
  };

  const calcularIngresos = () => {
    if (!transacciones || transacciones.length === 0) return 0;
    const ingresos = transacciones
      .filter(transaccion => transaccion.tipo === 'ingreso')
      .reduce((acc, transaccion) => acc + Number(transaccion.monto), 0);
    return Number(ingresos) || 0;
  };

  const calcularEgresos = () => {
    if (!transacciones || transacciones.length === 0) return 0;
    const egresos = transacciones
      .filter(transaccion => transaccion.tipo === 'egreso')
      .reduce((acc, transaccion) => acc + Number(transaccion.monto), 0);
    return Number(egresos) || 0;
  };

  const calcularValorInventario = () => {
    if (!productos || productos.length === 0) return 0;
    const valor = productos.reduce((acc, producto) => {
      return acc + (producto.precio * producto.stock);
    }, 0);
    return Number(valor) || 0;
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
          <Typography variant="h4">Financiero</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Nueva Transacción
          </Button>
        </Box>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Balance Total
                </Typography>
                <Typography variant="h4" color={calcularBalance() >= 0 ? 'success.main' : 'error.main'}>
                  Q{Number(calcularBalance()).toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Ingresos Totales
                </Typography>
                <Typography variant="h4" color="success.main">
                  Q{Number(calcularIngresos()).toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Egresos Totales
                </Typography>
                <Typography variant="h4" color="error.main">
                  Q{Number(calcularEgresos()).toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Valor del Inventario
                </Typography>
                <Typography variant="h4" color="primary.main">
                  Q{Number(calcularValorInventario()).toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transacciones.map((transaccion) => (
                <TableRow key={transaccion._id}>
                  <TableCell>{new Date(transaccion.fecha).toLocaleDateString()}</TableCell>
                  <TableCell>{transaccion.tipo}</TableCell>
                  <TableCell>Q{Number(transaccion.monto).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell>{transaccion.descripcion}</TableCell>
                  <TableCell>{transaccion.categoria}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(transaccion)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(transaccion._id)} color="error">
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
            {editingTransaccion ? 'Editar Transacción' : 'Nueva Transacción'}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <FormControl fullWidth required>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={formData.tipo}
                    label="Tipo"
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  >
                    <MenuItem value="ingreso">Ingreso</MenuItem>
                    <MenuItem value="egreso">Egreso</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Monto"
                  type="number"
                  value={formData.monto}
                  onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                  fullWidth
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    startAdornment: 'Q'
                  }}
                />
                <TextField
                  label="Descripción"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  fullWidth
                  required
                  multiline
                  rows={3}
                />
                <FormControl fullWidth required>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={formData.categoria}
                    label="Categoría"
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  >
                    {categorias.map((categoria) => (
                      <MenuItem key={categoria.value} value={categoria.value}>
                        {categoria.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth required>
                  <InputLabel>Método de Pago</InputLabel>
                  <Select
                    value={formData.metodoPago}
                    label="Método de Pago"
                    onChange={(e) => setFormData({ ...formData, metodoPago: e.target.value })}
                  >
                    <MenuItem value="efectivo">Efectivo</MenuItem>
                    <MenuItem value="tarjeta">Tarjeta</MenuItem>
                    <MenuItem value="transferencia">Transferencia</MenuItem>
                    <MenuItem value="otro">Otro</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth required>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={formData.estado}
                    label="Estado"
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  >
                    <MenuItem value="pendiente">Pendiente</MenuItem>
                    <MenuItem value="completado">Completado</MenuItem>
                    <MenuItem value="cancelado">Cancelado</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="submit" variant="contained" color="primary">
                {editingTransaccion ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Financiero; 