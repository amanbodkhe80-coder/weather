import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme } from './theme';
import WeatherDashboard from './components/WeatherDashboard';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ErrorBoundary>
        <WeatherDashboard />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
