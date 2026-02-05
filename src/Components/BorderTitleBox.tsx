import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

interface BorderTitleBoxProps {
  title: string;
  children: ReactNode;
}

function BorderTitleBox({ title, children }: BorderTitleBoxProps) {
  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '16px',
        position: 'relative',
        boxSizing: 'border-box', // Ensures padding and border are included in width
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          position: 'absolute',
          top: '-10px',
          left: '10px',
          backgroundColor: 'background.paper',
          padding: '0 8px',
          color: 'text.primary',
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export default BorderTitleBox;
