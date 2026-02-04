// src/components/Layout.tsx
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useApplication } from '../ApplicationContext/useApplication';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { login, logout, isAuthenticated } = useApplication();

  return (
    <>
      <AppBar position="static" sx={{ width: '100%' }}>
        <Container disableGutters>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {/* Linkerzijde: App naam */}
            <Typography
              variant="h6"
              component="div"
              sx={{ display: 'flex', alignItems: 'center' }}
            >Verkenners</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              {isAuthenticated ? (
                <Button color="inherit" onClick={logout}>Uitloggen</Button>
              ) : (
                <Button color="inherit" onClick={login}>Inloggen</Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hoofdinhoud */}
      <Container disableGutters sx={{ padding: 0 }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;
