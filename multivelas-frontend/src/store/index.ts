import { configureStore } from '@reduxjs/toolkit';
import productoReducer from './slices/productoSlice';
import ventaReducer from './slices/ventaSlice';
import empleadoReducer from './slices/empleadoSlice';
import financieroReducer from './slices/financieroSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    productos: productoReducer,
    ventas: ventaReducer,
    empleados: empleadoReducer,
    financiero: financieroReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 