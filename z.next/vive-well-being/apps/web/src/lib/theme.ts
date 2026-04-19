import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#10B981',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4e5c71',
    },
    background: {
      default: '#f4f6ff',
      paper: '#ffffff',
    },
    text: {
      primary: '#0d1c2f',
      secondary: '#3f4944',
    },
  },
  typography: {
    fontFamily: '"Inter", "Manrope", sans-serif',
    h1: { fontFamily: 'Manrope', fontWeight: 800 },
    h2: { fontFamily: 'Manrope', fontWeight: 700 },
    h3: { fontFamily: 'Manrope', fontWeight: 700 },
    h4: { fontFamily: 'Manrope', fontWeight: 600 },
    h5: { fontFamily: 'Manrope', fontWeight: 600 },
    h6: { fontFamily: 'Manrope', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          padding: '10px 20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: 'none',
          border: '1px solid rgba(0,0,0,0.05)',
        },
      },
    },
  },
});
