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
  Avatar,
  Divider,
  Tab,
  Tabs,
  Chip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { empleadoService } from '../../services/api';
import { toast } from 'react-toastify';
import { ApiResponse } from '../../types/api';
import { Empleado } from '../../types/models';
import ImageDisplay from '../../components/ImageDisplay';

const Empleados: React.FC = () => {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [open, setOpen] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<Empleado | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [formData, setFormData] = useState<Partial<Empleado>>({
    nombreCompleto: '',
    dpi: '',
    nit: '',
    fechaNacimiento: '',
    edad: 0,
    genero: '',
    estadoCivil: '',
    nacionalidad: '',
    direccion: {
      calle: '',
      zona: '',
      colonia: '',
      municipio: '',
      departamento: ''
    },
    email: '',
    telefono: '',
    contactoEmergencia: {
      nombre: '',
      telefono: '',
      relacion: ''
    },
    numeroEmpleado: '',
    fechaContratacion: new Date().toISOString().split('T')[0],
    puesto: '',
    departamento: '',
    rol: 'vendedor',
    sueldoBase: 0,
    tipoContrato: '',
    horarioTrabajo: {
      dias: [],
      horaInicio: '',
      horaFin: ''
    },
    supervisor: '',
    numeroIGSS: '',
    numeroIRTRA: '',
    foto: '',
    documentos: [],
    notas: '',
    fechaFinContrato: '',
    estado: 'activo',
    password: '',
    datosBancarios: {
      banco: '',
      numeroCuenta: '',
      tipoCuenta: ''
    }
  });

  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const fetchEmpleados = async () => {
    try {
      const response = await empleadoService.obtenerTodos();
      if (response.data.success && Array.isArray(response.data.data)) {
        setEmpleados(response.data.data);
      } else {
        console.error('Formato de respuesta inválido:', response.data);
        toast.error('Error al cargar empleados: Formato de respuesta inválido');
        setEmpleados([]);
      }
    } catch (error) {
      console.error('Error al cargar empleados:', error);
      toast.error('Error al cargar empleados');
      setEmpleados([]);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const handleFieldChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        if (!newData[parent as keyof Empleado]) {
          newData[parent as keyof Empleado] = {} as any;
        }
        (newData[parent as keyof Empleado] as any)[child] = value;
        return newData;
      });
    } else {
      setFormData(prev => {
        const newData = { ...prev, [field]: value };
        if (field === 'fechaNacimiento') {
          newData.edad = calcularEdad(value);
        }
        return newData;
      });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor seleccione un archivo de imagen válido');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no debe superar los 5MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        foto: file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'contactoEmergencia' || key === 'direccion' || key === 'horarioTrabajo' || key === 'datosBancarios') {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (key === 'documentos') {
          const documentosArray = Array.isArray(value) ? value : [];
          formDataToSend.append(key, JSON.stringify(documentosArray));
        } else if (key === 'foto' && value instanceof File) {
          formDataToSend.append('foto', value);
        } else if (key === 'fechaNacimiento' || key === 'fechaContratacion' || key === 'fechaFinContrato') {
          if (value && typeof value === 'string') {
            formDataToSend.append(key, value);
          }
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, String(value));
        }
      });

      if (editingEmpleado) {
        const response = await empleadoService.actualizar(editingEmpleado._id, formDataToSend);
        if (response.data.success) {
          setOpen(false);
          fetchEmpleados();
          toast.success('Empleado actualizado exitosamente');
        } else {
          toast.error(response.data.message || 'Error al actualizar empleado');
        }
      } else {
        const response = await empleadoService.crear(formDataToSend);
        if (response.data.success) {
          setOpen(false);
          fetchEmpleados();
          toast.success('Empleado creado exitosamente');
        } else {
          toast.error(response.data.message || 'Error al crear empleado');
        }
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Error al procesar empleado');
    }
  };

  const handleDocumentosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const documentos = files.map(file => ({
      nombre: file.name,
      tipo: file.type,
      url: URL.createObjectURL(file)
    }));
    setFormData(prev => ({
      ...prev,
      documentos
    }));
  };

  const handleOpen = (empleado?: Empleado) => {
    if (empleado) {
      setEditingEmpleado(empleado);
      setFormData({
        ...empleado,
        fechaNacimiento: empleado.fechaNacimiento.split('T')[0],
        fechaContratacion: empleado.fechaContratacion.split('T')[0],
        fechaFinContrato: empleado.fechaFinContrato ? empleado.fechaFinContrato.split('T')[0] : ''
      });
    } else {
      setEditingEmpleado(null);
      setFormData({
        nombreCompleto: '',
        dpi: '',
        nit: '',
        fechaNacimiento: '',
        edad: 0,
        genero: '',
        estadoCivil: '',
        nacionalidad: '',
        direccion: {
          calle: '',
          zona: '',
          colonia: '',
          municipio: '',
          departamento: ''
        },
        email: '',
        telefono: '',
        contactoEmergencia: {
          nombre: '',
          telefono: '',
          relacion: ''
        },
        numeroEmpleado: '',
        fechaContratacion: new Date().toISOString().split('T')[0],
        puesto: '',
        departamento: '',
        rol: 'vendedor',
        sueldoBase: 0,
        tipoContrato: '',
        horarioTrabajo: {
          dias: [],
          horaInicio: '',
          horaFin: ''
        },
        supervisor: '',
        numeroIGSS: '',
        numeroIRTRA: '',
        foto: '',
        documentos: [],
        notas: '',
        fechaFinContrato: '',
        estado: 'activo',
        password: '',
        datosBancarios: {
          banco: '',
          numeroCuenta: '',
          tipoCuenta: ''
        }
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingEmpleado(null);
    setFormData({});
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este empleado?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete<ApiResponse<Empleado>>(
          `http://localhost:4000/api/empleados/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          toast.success('Empleado eliminado correctamente');
          fetchEmpleados();
        } else {
          toast.error(response.data.message || 'Error al eliminar empleado');
        }
      } catch (error: any) {
        console.error('Error:', error);
        toast.error(error.response?.data?.message || 'Error al eliminar empleado');
      }
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
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
          <Typography variant="h4">Empleados</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Nuevo Empleado
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Foto</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>DPI</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Puesto</TableCell>
                <TableCell>Departamento</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {empleados && empleados.length > 0 ? (
                empleados.map((empleado) => (
                  <TableRow key={empleado._id}>
                    <TableCell>
                      <ImageDisplay
                        src={empleado.foto ? `http://localhost:4000/uploads/${empleado.foto}` : ''}
                        alt={empleado.nombreCompleto || 'Empleado'}
                        fallbackText={empleado.nombreCompleto || 'E'}
                        size={50}
                      />
                    </TableCell>
                    <TableCell>{empleado.nombreCompleto || 'Sin nombre'}</TableCell>
                    <TableCell>{empleado.dpi || 'Sin DPI'}</TableCell>
                    <TableCell>{empleado.email || 'Sin email'}</TableCell>
                    <TableCell>{empleado.puesto || 'Sin puesto'}</TableCell>
                    <TableCell>{empleado.departamento || 'Sin departamento'}</TableCell>
                    <TableCell>
                      <Chip
                        label={empleado.estado || 'inactivo'}
                        color={empleado.estado === 'activo' ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpen(empleado)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(empleado._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No hay empleados registrados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre Completo"
                    value={formData.nombreCompleto || ''}
                    onChange={(e) => handleFieldChange('nombreCompleto', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="DPI"
                    value={formData.dpi || ''}
                    onChange={(e) => handleFieldChange('dpi', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="NIT"
                    value={formData.nit || ''}
                    onChange={(e) => handleFieldChange('nit', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Fecha de Nacimiento"
                    type="date"
                    value={formData.fechaNacimiento || ''}
                    onChange={(e) => handleFieldChange('fechaNacimiento', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Edad"
                    type="number"
                    value={formData.edad || ''}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Género</InputLabel>
                    <Select
                      value={formData.genero || ''}
                      onChange={(e) => handleFieldChange('genero', e.target.value)}
                      label="Género"
                    >
                      <MenuItem value="masculino">Masculino</MenuItem>
                      <MenuItem value="femenino">Femenino</MenuItem>
                      <MenuItem value="otro">Otro</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Estado Civil</InputLabel>
                    <Select
                      value={formData.estadoCivil || ''}
                      onChange={(e) => handleFieldChange('estadoCivil', e.target.value)}
                      label="Estado Civil"
                    >
                      <MenuItem value="soltero">Soltero(a)</MenuItem>
                      <MenuItem value="casado">Casado(a)</MenuItem>
                      <MenuItem value="divorciado">Divorciado(a)</MenuItem>
                      <MenuItem value="viudo">Viudo(a)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nacionalidad"
                    value={formData.nacionalidad || ''}
                    onChange={(e) => handleFieldChange('nacionalidad', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Dirección
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Calle"
                        value={formData.direccion?.calle || ''}
                        onChange={(e) => handleFieldChange('direccion.calle', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Zona"
                        value={formData.direccion?.zona || ''}
                        onChange={(e) => handleFieldChange('direccion.zona', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Colonia"
                        value={formData.direccion?.colonia || ''}
                        onChange={(e) => handleFieldChange('direccion.colonia', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Municipio"
                        value={formData.direccion?.municipio || ''}
                        onChange={(e) => handleFieldChange('direccion.municipio', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Departamento"
                        value={formData.direccion?.departamento || ''}
                        onChange={(e) => handleFieldChange('direccion.departamento', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contraseña"
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    value={formData.telefono || ''}
                    onChange={(e) => handleFieldChange('telefono', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Contacto de Emergencia
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nombre"
                        value={formData.contactoEmergencia?.nombre || ''}
                        onChange={(e) => handleFieldChange('contactoEmergencia.nombre', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Teléfono"
                        value={formData.contactoEmergencia?.telefono || ''}
                        onChange={(e) => handleFieldChange('contactoEmergencia.telefono', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Relación"
                        value={formData.contactoEmergencia?.relacion || ''}
                        onChange={(e) => handleFieldChange('contactoEmergencia.relacion', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Número de Empleado"
                    value={formData.numeroEmpleado || ''}
                    onChange={(e) => handleFieldChange('numeroEmpleado', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Fecha de Contratación"
                    type="date"
                    value={formData.fechaContratacion || ''}
                    onChange={(e) => handleFieldChange('fechaContratacion', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Puesto"
                    value={formData.puesto || ''}
                    onChange={(e) => handleFieldChange('puesto', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Departamento"
                    value={formData.departamento || ''}
                    onChange={(e) => handleFieldChange('departamento', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Rol</InputLabel>
                    <Select
                      value={formData.rol || ''}
                      onChange={(e) => handleFieldChange('rol', e.target.value)}
                      label="Rol"
                      required
                    >
                      <MenuItem value="admin">Administrador</MenuItem>
                      <MenuItem value="vendedor">Vendedor</MenuItem>
                      <MenuItem value="financiero">Financiero</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Sueldo Base"
                    type="number"
                    value={formData.sueldoBase || ''}
                    onChange={(e) => handleFieldChange('sueldoBase', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Contrato</InputLabel>
                    <Select
                      value={formData.tipoContrato || ''}
                      onChange={(e) => handleFieldChange('tipoContrato', e.target.value)}
                      label="Tipo de Contrato"
                      required
                    >
                      <MenuItem value="temporal">Temporal</MenuItem>
                      <MenuItem value="permanente">Permanente</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Horario de Trabajo
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Hora de Inicio"
                        type="time"
                        value={formData.horarioTrabajo?.horaInicio || ''}
                        onChange={(e) => handleFieldChange('horarioTrabajo.horaInicio', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Hora de Fin"
                        type="time"
                        value={formData.horarioTrabajo?.horaFin || ''}
                        onChange={(e) => handleFieldChange('horarioTrabajo.horaFin', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Supervisor"
                    value={formData.supervisor || ''}
                    onChange={(e) => handleFieldChange('supervisor', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Número IGSS"
                    value={formData.numeroIGSS || ''}
                    onChange={(e) => handleFieldChange('numeroIGSS', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Número IRTRA"
                    value={formData.numeroIRTRA || ''}
                    onChange={(e) => handleFieldChange('numeroIRTRA', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Foto"
                    type="file"
                    onChange={handlePhotoChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notas"
                    multiline
                    rows={4}
                    value={formData.notas || ''}
                    onChange={(e) => handleFieldChange('notas', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Fecha Fin de Contrato"
                    type="date"
                    value={formData.fechaFinContrato || ''}
                    onChange={(e) => handleFieldChange('fechaFinContrato', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      value={formData.estado || ''}
                      onChange={(e) => handleFieldChange('estado', e.target.value)}
                      label="Estado"
                      required
                    >
                      <MenuItem value="activo">Activo</MenuItem>
                      <MenuItem value="inactivo">Inactivo</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Datos Bancarios
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Banco"
                        value={formData.datosBancarios?.banco || ''}
                        onChange={(e) => handleFieldChange('datosBancarios.banco', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Número de Cuenta"
                        value={formData.datosBancarios?.numeroCuenta || ''}
                        onChange={(e) => handleFieldChange('datosBancarios.numeroCuenta', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Tipo de Cuenta"
                        value={formData.datosBancarios?.tipoCuenta || ''}
                        onChange={(e) => handleFieldChange('datosBancarios.tipoCuenta', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
              {editingEmpleado ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Empleados; 