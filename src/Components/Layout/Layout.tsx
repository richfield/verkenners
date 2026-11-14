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
  Avatar,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useApplication } from '../ApplicationContext/useApplication';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import React from 'react';
import { Menu as MenuIcon, Person } from '@mui/icons-material';
import SpreadsheetPicker from '../SpreadsheetPicker/SpreadsheetPicker';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { login, logout, user, language, setLanguage, translate, isAuthenticated, spreadsheetId, apiFetch } = useApplication();
  const [spreadsheetTitle, setSpreadsheetTitle] = React.useState<{ id: string; title: string | null } | null>(null);

  React.useEffect(() => {
    if (!isAuthenticated || !spreadsheetId) {
      return;
    }

    let active = true;
    const loadTitle = async () => {
      try {
        const response = await apiFetch<{ properties?: { title?: string } }>(
          `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=properties.title`,
        );
        const title = response.data?.properties?.title;
        if (response.status !== 200 || !title) {
          throw new Error('Spreadsheet title was not returned');
        }
        if (active) {
          setSpreadsheetTitle({ id: spreadsheetId, title });
        }
      } catch (error) {
        console.error('Failed to load spreadsheet title:', error);
        if (active) {
          setSpreadsheetTitle({ id: spreadsheetId, title: null });
        }
      }
    };
    void loadTitle();
    return () => { active = false; };
  }, [apiFetch, isAuthenticated, spreadsheetId]);

  const currentSpreadsheetTitle = isAuthenticated && spreadsheetTitle?.id === spreadsheetId ? spreadsheetTitle : null;
  const confirmLogout = () => {
    if (window.confirm(translate('confirmLogout'))) {
      logout();
    }
  };

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
                    <IconButton {...bindTrigger(popupState)} aria-label={translate('menu')}>
                      <MenuIcon />
                    </IconButton>
                    <Menu {...bindMenu(popupState)}>
                      <MenuItem onClick={popupState.close} component={Link} to="/tos">
                        {translate('termsOfService')}
                      </MenuItem>
                      <MenuItem onClick={popupState.close} component={Link} to="/pp">
                        {translate('privacyPolicy')}
                      </MenuItem>
                      <MenuItem onClick={popupState.close} component={Link} to="/incidenten">
                        {translate('allIncidents')}
                      </MenuItem>
                      <MenuItem onClick={popupState.close} component={Link} to="/verkenners">
                        {translate('scouts')}
                      </MenuItem>
                      <MenuItem disabled>{translate('language')}</MenuItem>
                      <MenuItem selected={language === 'en'} onClick={() => { setLanguage('en'); popupState.close(); }}>
                        {translate('english')}
                      </MenuItem>
                      <MenuItem selected={language === 'nl'} onClick={() => { setLanguage('nl'); popupState.close(); }}>
                        {translate('dutch')}
                      </MenuItem>
                    </Menu>

                  </React.Fragment>
                )}
              </PopupState>
              <Button color="inherit" component={Link} to="/" sx={{ textTransform: 'none' }}>
              <Typography
                variant="h6"
                component="div"
                sx={{ display: 'flex', alignItems: 'center' }}
              >{currentSpreadsheetTitle?.title ?? 'Verkenners'}</Typography>
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button color="inherit" component={Link} to="/opkomsten/list">
                {translate('list')}
              </Button>
              {user && user.picture ? (
                <IconButton color="inherit" onClick={confirmLogout}>
                  <Avatar
                    src={user.picture}
                    alt={translate('userAvatar')}
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

      {currentSpreadsheetTitle && !currentSpreadsheetTitle.title && (
        <Alert severity="error">{translate('spreadsheetTitleError')}</Alert>
      )}
      {/* Hoofdinhoud */}
      <Container disableGutters sx={{ padding: 0 }}>
        {isAuthenticated && !spreadsheetId ? <SpreadsheetPicker /> : children}
      </Container>
    </>
  );
};

export default Layout;
