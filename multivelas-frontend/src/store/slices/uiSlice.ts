import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  };
  loading: boolean;
  dialog: {
    open: boolean;
    type: string | null;
    data: any | null;
  };
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: 'light',
  snackbar: {
    open: false,
    message: '',
    severity: 'info',
  },
  loading: false,
  dialog: {
    open: false,
    type: null,
    data: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    showSnackbar: (state, action: PayloadAction<{
      message: string;
      severity: 'success' | 'error' | 'warning' | 'info';
    }>) => {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity,
      };
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    openDialog: (state, action: PayloadAction<{
      type: string;
      data?: any;
    }>) => {
      state.dialog = {
        open: true,
        type: action.payload.type,
        data: action.payload.data,
      };
    },
    closeDialog: (state) => {
      state.dialog = {
        open: false,
        type: null,
        data: null,
      };
    },
  },
});

export const {
  toggleSidebar,
  setTheme,
  showSnackbar,
  hideSnackbar,
  setLoading,
  openDialog,
  closeDialog,
} = uiSlice.actions;

export default uiSlice.reducer; 