import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Empleado } from '../../types/models';
import { empleadoService } from '../../services/api';

interface EmpleadoState {
  empleados: Empleado[];
  loading: boolean;
  error: string | null;
  empleadoSeleccionado: Empleado | null;
}

const initialState: EmpleadoState = {
  empleados: [],
  loading: false,
  error: null,
  empleadoSeleccionado: null,
};

export const obtenerEmpleados = createAsyncThunk(
  'empleados/obtenerTodos',
  async () => {
    const response = await empleadoService.obtenerTodos();
    return response.data;
  }
);

export const crearEmpleado = createAsyncThunk(
  'empleados/crear',
  async (empleado: Omit<Empleado, '_id'>) => {
    const response = await empleadoService.crear(empleado);
    return response.data;
  }
);

export const actualizarEmpleado = createAsyncThunk(
  'empleados/actualizar',
  async ({ id, empleado }: { id: string; empleado: Partial<Empleado> }) => {
    const response = await empleadoService.actualizar(id, empleado);
    return response.data;
  }
);

export const eliminarEmpleado = createAsyncThunk(
  'empleados/eliminar',
  async (id: string) => {
    await empleadoService.eliminar(id);
    return id;
  }
);

export const obtenerEmpleadosPorRol = createAsyncThunk(
  'empleados/obtenerPorRol',
  async (rol: string) => {
    const response = await empleadoService.obtenerPorRol(rol);
    return response.data;
  }
);

export const actualizarDatosBancarios = createAsyncThunk(
  'empleados/actualizarDatosBancarios',
  async ({ id, datosBancarios }: { id: string; datosBancarios: Empleado['datosBancarios'] }) => {
    const response = await empleadoService.actualizarDatosBancarios(id, datosBancarios);
    return response.data;
  }
);

export const obtenerNomina = createAsyncThunk(
  'empleados/obtenerNomina',
  async () => {
    const response = await empleadoService.obtenerNomina();
    return response.data;
  }
);

const empleadoSlice = createSlice({
  name: 'empleados',
  initialState,
  reducers: {
    seleccionarEmpleado: (state, action) => {
      state.empleadoSeleccionado = action.payload;
    },
    limpiarEmpleadoSeleccionado: (state) => {
      state.empleadoSeleccionado = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener todos los empleados
      .addCase(obtenerEmpleados.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(obtenerEmpleados.fulfilled, (state, action) => {
        state.loading = false;
        state.empleados = action.payload;
      })
      .addCase(obtenerEmpleados.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al obtener empleados';
      })
      // Crear empleado
      .addCase(crearEmpleado.fulfilled, (state, action) => {
        state.empleados.push(action.payload);
      })
      // Actualizar empleado
      .addCase(actualizarEmpleado.fulfilled, (state, action) => {
        const index = state.empleados.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.empleados[index] = action.payload;
        }
        if (state.empleadoSeleccionado?._id === action.payload._id) {
          state.empleadoSeleccionado = action.payload;
        }
      })
      // Eliminar empleado
      .addCase(eliminarEmpleado.fulfilled, (state, action) => {
        state.empleados = state.empleados.filter(e => e._id !== action.payload);
        if (state.empleadoSeleccionado?._id === action.payload) {
          state.empleadoSeleccionado = null;
        }
      })
      // Obtener empleados por rol
      .addCase(obtenerEmpleadosPorRol.fulfilled, (state, action) => {
        state.empleados = action.payload;
      })
      // Actualizar datos bancarios
      .addCase(actualizarDatosBancarios.fulfilled, (state, action) => {
        const index = state.empleados.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.empleados[index] = action.payload;
        }
        if (state.empleadoSeleccionado?._id === action.payload._id) {
          state.empleadoSeleccionado = action.payload;
        }
      });
  },
});

export const { seleccionarEmpleado, limpiarEmpleadoSeleccionado } = empleadoSlice.actions;
export default empleadoSlice.reducer; 