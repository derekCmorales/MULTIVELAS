import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Producto } from '../../types/models';
import { productoService } from '../../services/api';

interface ProductoState {
  productos: Producto[];
  loading: boolean;
  error: string | null;
  productoSeleccionado: Producto | null;
}

const initialState: ProductoState = {
  productos: [],
  loading: false,
  error: null,
  productoSeleccionado: null,
};

export const obtenerProductos = createAsyncThunk(
  'productos/obtenerTodos',
  async () => {
    const response = await productoService.obtenerTodos();
    return response.data;
  }
);

export const crearProducto = createAsyncThunk(
  'productos/crear',
  async (producto: Omit<Producto, '_id'>) => {
    const response = await productoService.crear(producto);
    return response.data;
  }
);

export const actualizarProducto = createAsyncThunk(
  'productos/actualizar',
  async ({ id, producto }: { id: string; producto: Partial<Producto> }) => {
    const response = await productoService.actualizar(id, producto);
    return response.data;
  }
);

export const eliminarProducto = createAsyncThunk(
  'productos/eliminar',
  async (id: string) => {
    await productoService.eliminar(id);
    return id;
  }
);

const productoSlice = createSlice({
  name: 'productos',
  initialState,
  reducers: {
    seleccionarProducto: (state, action) => {
      state.productoSeleccionado = action.payload;
    },
    limpiarProductoSeleccionado: (state) => {
      state.productoSeleccionado = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener todos los productos
      .addCase(obtenerProductos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(obtenerProductos.fulfilled, (state, action) => {
        state.loading = false;
        state.productos = action.payload;
      })
      .addCase(obtenerProductos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al obtener productos';
      })
      // Crear producto
      .addCase(crearProducto.fulfilled, (state, action) => {
        state.productos.push(action.payload);
      })
      // Actualizar producto
      .addCase(actualizarProducto.fulfilled, (state, action) => {
        const index = state.productos.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.productos[index] = action.payload;
        }
        if (state.productoSeleccionado?._id === action.payload._id) {
          state.productoSeleccionado = action.payload;
        }
      })
      // Eliminar producto
      .addCase(eliminarProducto.fulfilled, (state, action) => {
        state.productos = state.productos.filter(p => p._id !== action.payload);
        if (state.productoSeleccionado?._id === action.payload) {
          state.productoSeleccionado = null;
        }
      });
  },
});

export const { seleccionarProducto, limpiarProductoSeleccionado } = productoSlice.actions;
export default productoSlice.reducer; 