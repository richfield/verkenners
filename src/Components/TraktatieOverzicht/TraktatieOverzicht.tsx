import { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useApplication } from '../ApplicationContext/useApplication';
import type { Traktatie } from '../../Types';

const TraktatieOverzicht = () => {
  const { apiFetch, translate } = useApplication();
  const [traktaties, setTraktaties] = useState<Traktatie[]>([]);

  useEffect(() => {
    const loadTraktaties = async () => {
      const response = await apiFetch<Traktatie[]>('/api/opkomsten/traktaties');
      if (response.status === 200) {
        setTraktaties(response.data);
      }
    };
    loadTraktaties();
  }, [apiFetch]);

  const dueTraktaties = traktaties.filter((item) => Math.floor(item.AantalKeerVergeten / 3) > item.Getrakteerd);

  return (
    <Box component="section" sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>{translate('needsTreat')}</Typography>
      {dueTraktaties.length === 0 ? (
        <Typography>{translate('noTreats')}</Typography>
      ) : (
        <List dense>
          {dueTraktaties.map((treat) => (
            <ListItem key={treat.RowNumber} disableGutters>
              <ListItemText
                primary={treat.VerkennerNaam}
                secondary={`${treat.AantalKeerVergeten} ${translate('times')}, ${treat.Getrakteerd} ${translate('treatsSupplied')}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default TraktatieOverzicht;