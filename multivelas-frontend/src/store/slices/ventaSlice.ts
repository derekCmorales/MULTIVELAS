import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Venta } from '../../types/models';
import { ventaService } from '../../services/api';

interface VentaState {
  ventas: Venta[];
  loading: boolean;
  error: string | null;
  ventaSeleccionada: Venta | null;
}

const initialState: VentaState = {
  ventas: [],
  loading: false,
  error: null,
  ventaSeleccionada: null,
};

export const obtenerVentas = createAsyncThunk(
  'ventas/obtenerTodas',
  async () => {
    const response = await ventaService.obtenerTodas();
    return response.data;
  }
);

export const crearVenta = createAsyncThunk(
  'ventas/crear',
  async (venta: Omit<Venta, '_id'>) => {
    const response = await ventaService.crear(venta);
    return response.data;
  }
);

export const cancelarVenta = createAsyncThunk(
  'ventas/cancelar',
  async (id: string) => {
    const response = await ventaService.cancelar(id);
    return response.data;
  }
);

export const obtenerVentasPorPeriodo = createAsyncThunk(
  'ventas/obtenerPorPeriodo',
  async ({ fechaInicio, fechaFin }: { fechaInicio: string; fechaFin: string }) => {
    const response = await ventaService.obtenerPorPeriodo(fechaInicio, fechaFin);
    return response.data;
  }
);

const ventaSlice = createSlice({
  name: 'ventas',
  initialState,
  reducers: {
    seleccionarVenta: (state, action) => {
      state.ventaSeleccionada = action.payload;
    },
    limpiarVentaSeleccionada: (state) => {
      state.ventaSeleccionada = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener todas las ventas
      .addCase(obtenerVentas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(obtenerVentas.fulfilled, (state, action) => {
        state.loading = false;
        state.ventas = action.payload;
      })
      .addCase(obtenerVentas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al obtener ventas';
      })
      // Crear venta
      .addCase(crearVenta.fulfilled, (state, action) => {
        state.ventas.push(action.payload);
      })
      // Cancelar venta
      .addCase(cancelarVenta.fulfilled, (state, action) => {
        const index = state.ventas.findIndex(v => v._id === action.payload._id);
        if (index !== -1) {
          state.ventas[index] = action.payload;
        }
        if (state.ventaSeleccionada?._id === action.payload._id) {
          state.ventaSeleccionada = action.payload;
        }
      })
      // Obtener ventas por periodo
      .addCase(obtenerVentasPorPeriodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(obtenerVentasPorPeriodo.fulfilled, (state, action) => {
        state.loading = false;
        state.ventas = action.payload;
      })
      .addCase(obtenerVentasPorPeriodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al obtener ventas del periodo';
      });
  },
});

export const { seleccionarVenta, limpiarVentaSeleccionada } = ventaSlice.actions;
export default ventaSlice.reducer; 