import { Box, Button, Link as MuiLink, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useApplication } from '../ApplicationContext/useApplication';
import ViewOpkomst from '../ViewOpkomst/ViewOpkomst';

const Home = () => {
  const { isAuthenticated } = useApplication();

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', px: 3, py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Verkenners
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Attendance planning for the Zeeverkenners scouting group
      </Typography>
      <Typography paragraph>

        Verkenners helps authorized group leaders manage scouting attendance. Users sign in with Google to view and update the group's shared attendance spreadsheet, including planning dates, leadership assignments, and attendance notes.
      </Typography>
      <Typography paragraph>
        The application only uses Google data to provide this attendance administration service. It does not sell personal information or use Google data for advertising.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 4 }}>
        <Button component={Link} to="/login" variant="contained">
          Sign in with Google
        </Button>
        <MuiLink component={Link} to="/pp">
          Privacy policy
        </MuiLink>
        <MuiLink component={Link} to="/tos">
          Terms of service
        </MuiLink>
      </Box>


      {isAuthenticated && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" component="h3" gutterBottom>
            Next Opkomst
          </Typography>
          <ViewOpkomst />
        </Box>
      )}
    </Box>
  );
};

export default Home;
