import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Financiero, Balance, Transaccion } from '../../types/models';
import { financieroService } from '../../services/api';

interface FinancieroState {
  balanceGeneral: Balance | null;
  transacciones: Transaccion[];
  balances: Balance[];
  loading: boolean;
  error: string | null;
}

const initialState: FinancieroState = {
  balanceGeneral: null,
  transacciones: [],
  balances: [],
  loading: false,
  error: null,
};

export const obtenerBalanceGeneral = createAsyncThunk(
  'financiero/obtenerBalanceGeneral',
  async () => {
    const response = await financieroService.obtenerBalanceGeneral();
    return response.data;
  }
);

export const registrarTransaccion = createAsyncThunk(
  'financiero/registrarTransaccion',
  async (transaccion: Omit<Transaccion, 'fecha'>) => {
    const response = await financieroService.registrarTransaccion(transaccion);
    return response.data;
  }
);

export const obtenerTransaccionesPorPeriodo = createAsyncThunk(
  'financiero/obtenerTransaccionesPorPeriodo',
  async ({ fechaInicio, fechaFin }: { fechaInicio: string; fechaFin: string }) => {
    const response = await financieroService.obtenerTransaccionesPorPeriodo(fechaInicio, fechaFin);
    return response.data;
  }
);

export const obtenerResumen = createAsyncThunk(
  'financiero/obtenerResumen',
  async () => {
    const response = await financieroService.obtenerResumen();
    return response.data;
  }
);

export const crearBalance = createAsyncThunk(
  'financiero/crearBalance',
  async (balance: Omit<Balance, 'fecha'>) => {
    const response = await financieroService.crearBalance(balance);
    return response.data;
  }
);

export const obtenerBalancesPorPeriodo = createAsyncThunk(
  'financiero/obtenerBalancesPorPeriodo',
  async ({ fechaInicio, fechaFin }: { fechaInicio: string; fechaFin: string }) => {
    const response = await financieroService.obtenerBalancesPorPeriodo(fechaInicio, fechaFin);
    return response.data;
  }
);

const financieroSlice = createSlice({
  name: 'financiero',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Obtener balance general
      .addCase(obtenerBalanceGeneral.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(obtenerBalanceGeneral.fulfilled, (state, action) => {
        state.loading = false;
        state.balanceGeneral = action.payload;
      })
      .addCase(obtenerBalanceGeneral.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al obtener balance general';
      })
      // Registrar transacción
      .addCase(registrarTransaccion.fulfilled, (state, action) => {
        state.transacciones.push(action.payload);
      })
      // Obtener transacciones por periodo
      .addCase(obtenerTransaccionesPorPeriodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(obtenerTransaccionesPorPeriodo.fulfilled, (state, action) => {
        state.loading = false;
        state.transacciones = action.payload;
      })
      .addCase(obtenerTransaccionesPorPeriodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al obtener transacciones del periodo';
      })
      // Crear balance
      .addCase(crearBalance.fulfilled, (state, action) => {
        state.balances.push(action.payload);
      })
      // Obtener balances por periodo
      .addCase(obtenerBalancesPorPeriodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(obtenerBalancesPorPeriodo.fulfilled, (state, action) => {
        state.loading = false;
        state.balances = action.payload;
      })
      .addCase(obtenerBalancesPorPeriodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al obtener balances del periodo';
      });
  },
});

export default financieroSlice.reducer; 