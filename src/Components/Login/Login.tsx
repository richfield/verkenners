// src/pages/LoginPage.tsx
import { Typography, Button, Box } from '@mui/material';
import { useApplication } from '../ApplicationContext/useApplication';

const LoginPage = () => {
  const { login, translate } = useApplication();

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4">{translate('signIn')}</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={login}
        sx={{ mt: 2 }}
      >
        {translate('signInWithGoogle')}
      </Button>
    </Box>
  );
};

export default LoginPage;
