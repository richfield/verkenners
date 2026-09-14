import { Box, Button, Link as MuiLink, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useApplication } from '../ApplicationContext/useApplication';
import ViewOpkomst from '../ViewOpkomst/ViewOpkomst';
const Home = () => {
  const { isAuthenticated, login, translate } = useApplication();

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', px: 3, py: 8 }}>
      {!isAuthenticated && (
        <>
          <Typography variant="h3" component="h1" gutterBottom>
            {translate('homeTitle')}
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            {translate('homeSubtitle')}
          </Typography>
          <Typography paragraph>

            {translate('homeDescription')}
          </Typography>
          <Typography paragraph>
            {translate('homePrivacy')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 4 }}>
            <Button variant="contained"
              color="primary"
              onClick={login}
              sx={{ mt: 2 }}
            >
              {translate('signInWithGoogle')}
            </Button>
            <MuiLink component={Link} to="/pp">
              {translate('privacyPolicy')}
            </MuiLink>
            <MuiLink component={Link} to="/tos">
              {translate('termsOfService')}
            </MuiLink>
          </Box>
        </>
      )}


      {isAuthenticated && (
          <ViewOpkomst />
      )}
    </Box>
  );
};

export default Home;
