import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" sx={{ backgroundColor: '#0a192f', color: 'white' }}>
          <Typography variant="h3" color="error" gutterBottom align="center">
            Oops, something went wrong.
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom align="center" sx={{ mb: 4 }}>
            The application encountered an unexpected error displaying the dashboard.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
