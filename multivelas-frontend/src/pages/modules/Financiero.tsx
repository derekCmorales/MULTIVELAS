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
  MenuItem
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Transaccion {
  _id: string;
  tipo: 'ingreso' | 'egreso';
  monto: number;
  descripcion: string;
  fecha: string;
  categoria: string;
}

const validationSchema = yup.object({
  tipo: yup.string().required('Tipo es requerido'),
  monto: yup.number().required('Monto es requerido').min(0, 'Monto debe ser mayor a 0'),
  descripcion: yup.string().required('Descripción es requerida'),
  categoria: yup.string().required('Categoría es requerida')
});

const Financiero: React.FC = () => {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [open, setOpen] = useState(false);
  const [editingTransaccion, setEditingTransaccion] = useState<Transaccion | null>(null);

  const fetchTransacciones = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/financiero', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransacciones(response.data as Transaccion[]);
    } catch (error) {
      console.error('Error al cargar transacciones:', error);
      toast.error('Error al cargar transacciones');
    }
  };

  useEffect(() => {
    fetchTransacciones();
  }, []);

  const formik = useFormik({
    initialValues: {
      tipo: '',
      monto: '',
      descripcion: '',
      categoria: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('token');
        if (editingTransaccion) {
          await axios.put(
            `http://localhost:4000/api/financiero/${editingTransaccion._id}`,
            values,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success('Transacción actualizada correctamente');
        } else {
          await axios.post(
            'http://localhost:4000/api/financiero',
            values,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success('Transacción creada correctamente');
        }
        handleClose();
        fetchTransacciones();
      } catch (error) {
        console.error('Error al guardar transacción:', error);
        toast.error('Error al guardar transacción');
      }
    }
  });

  const handleOpen = (transaccion?: Transaccion) => {
    if (transaccion) {
      setEditingTransaccion(transaccion);
      formik.setValues({
        tipo: transaccion.tipo,
        monto: transaccion.monto.toString(),
        descripcion: transaccion.descripcion,
        categoria: transaccion.categoria
      });
    } else {
      setEditingTransaccion(null);
      formik.resetForm();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTransaccion(null);
    formik.resetForm();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta transacción?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:4000/api/financiero/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Transacción eliminada correctamente');
        fetchTransacciones();
      } catch (error) {
        console.error('Error al eliminar transacción:', error);
        toast.error('Error al eliminar transacción');
      }
    }
  };

  const calcularBalance = () => {
    return transacciones.reduce((acc, trans) => {
      return acc + (trans.tipo === 'ingreso' ? trans.monto : -trans.monto);
    }, 0);
  };

  const calcularIngresos = () => {
    return transacciones
      .filter(trans => trans.tipo === 'ingreso')
      .reduce((acc, trans) => acc + trans.monto, 0);
  };

  const calcularEgresos = () => {
    return transacciones
      .filter(trans => trans.tipo === 'egreso')
      .reduce((acc, trans) => acc + trans.monto, 0);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Financiero</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
        >
          Nueva Transacción
        </Button>
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Balance Total
              </Typography>
              <Typography variant="h4" color={calcularBalance() >= 0 ? 'success.main' : 'error.main'}>
                ${calcularBalance().toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Ingresos
              </Typography>
              <Typography variant="h4" color="success.main">
                ${calcularIngresos().toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Egresos
              </Typography>
              <Typography variant="h4" color="error.main">
                ${calcularEgresos().toFixed(2)}
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
                <TableCell color={transaccion.tipo === 'ingreso' ? 'success.main' : 'error.main'}>
                  ${transaccion.monto.toFixed(2)}
                </TableCell>
                <TableCell>{transaccion.descripcion}</TableCell>
                <TableCell>{transaccion.categoria}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleOpen(transaccion)}
                    color="primary"
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleDelete(transaccion._id)}
                    color="error"
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTransaccion ? 'Editar Transacción' : 'Nueva Transacción'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  name="tipo"
                  label="Tipo"
                  value={formik.values.tipo}
                  onChange={formik.handleChange}
                  error={formik.touched.tipo && Boolean(formik.errors.tipo)}
                  helperText={formik.touched.tipo && formik.errors.tipo}
                >
                  <MenuItem value="ingreso">Ingreso</MenuItem>
                  <MenuItem value="egreso">Egreso</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="monto"
                  label="Monto"
                  type="number"
                  value={formik.values.monto}
                  onChange={formik.handleChange}
                  error={formik.touched.monto && Boolean(formik.errors.monto)}
                  helperText={formik.touched.monto && formik.errors.monto}
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
              <Grid item xs={12}>
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
                  <MenuItem value="ventas">Ventas</MenuItem>
                  <MenuItem value="salarios">Salarios</MenuItem>
                  <MenuItem value="servicios">Servicios</MenuItem>
                  <MenuItem value="materiales">Materiales</MenuItem>
                  <MenuItem value="otros">Otros</MenuItem>
                </TextField>
              </Grid>
            </Grid>
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
  );
};

export default Financiero; 