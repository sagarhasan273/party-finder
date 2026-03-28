import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import { theme } from './theme';
import { store } from './store';
import { AppRouter } from './router';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRouter />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1c2030',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#e8ecf0',
              fontFamily: '"DM Sans", sans-serif',
            },
          }}
        />
      </ThemeProvider>
    </Provider>
  );
}
