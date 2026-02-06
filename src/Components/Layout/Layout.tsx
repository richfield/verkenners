// src/components/Layout.tsx
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  MenuItem,
  Menu,
  IconButton,
  Avatar
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useApplication } from '../ApplicationContext/useApplication';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import React from 'react';
import { Menu as MenuIcon, Person } from '@mui/icons-material';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { login, logout, user } = useApplication();

  return (
    <>
      <AppBar position="static" sx={{ width: '100%' }}>
        <Container disableGutters>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {/* Linkerzijde: App naam */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <PopupState variant="popover" popupId="demo-popup-menu">
                {(popupState) => (
                  <React.Fragment>
                    <IconButton {...bindTrigger(popupState)}>
                      <MenuIcon />
                    </IconButton>
                    <Menu {...bindMenu(popupState)}>
                      <MenuItem onClick={popupState.close} component={Link} to="/tos">
                        Terms of Service
                      </MenuItem>
                      <MenuItem onClick={popupState.close} component={Link} to="/pp">
                        Privacy Policy
                      </MenuItem>

                    </Menu>

                  </React.Fragment>
                )}
              </PopupState>
              <Button color="inherit" component={Link} to="/">
              <Typography
                variant="h6"
                component="div"
                sx={{ display: 'flex', alignItems: 'center' }}
              >Verkenners</Typography>
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button color="inherit" component={Link} to="/opkomsten/list">
                Lijst
              </Button>
              {user && user.picture ? (
                <IconButton color="inherit" onClick={logout}>
                  <Avatar
                    src={user.picture}
                    alt="User Avatar"
                    style={{ width: "40px", height: "40px", marginRight: "10px" }}
                  />
                </IconButton>
              ) : (
                <IconButton color="inherit" onClick={login}>
                  <Person />
                </IconButton>
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
