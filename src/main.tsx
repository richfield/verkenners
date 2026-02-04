// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { GoogleOAuthWrapper } from './Components/GoogleOAuthWrapper/GoogleOAuthWrapper';
import { ApplicationProvider } from './Components/ApplicationContext/ApplicationContextProvider';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GoogleOAuthWrapper>
        <Router>
          <ApplicationProvider>
            <App />
          </ApplicationProvider>
        </Router>
      </GoogleOAuthWrapper>
    </ThemeProvider>
  </React.StrictMode>
);
