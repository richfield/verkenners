// src/pages/LoginPage.tsx
import { Typography, Button, Box } from '@mui/material';
import { useApplication } from '../ApplicationContext/useApplication';

const LoginPage = () => {
  const { login } = useApplication();

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4">Inloggen</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={login}
        sx={{ mt: 2 }}
      >
        Inloggen met Google
      </Button>
    </Box>
  );
};

export default LoginPage;
