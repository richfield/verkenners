import { useEffect, useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useApplication } from '../ApplicationContext/useApplication';
import type { UniformIncident } from '../../Types';
import TraktatieOverzicht from '../TraktatieOverzicht/TraktatieOverzicht';

const IncidentenOverzicht = () => {
  const { apiFetch, translate } = useApplication();
  const [incidents, setIncidents] = useState<UniformIncident[]>([]);

  useEffect(() => {
    const loadIncidents = async () => {
      const response = await apiFetch<UniformIncident[]>('/api/opkomsten/incidents');
      if (response.status === 200) {
        setIncidents(response.data);
      }
    };
    loadIncidents();
  }, [apiFetch]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>{translate('allIncidents')}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{translate('date')}</TableCell>
              <TableCell>{translate('scout')}</TableCell>
              <TableCell>{translate('type')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incidents.map((incident) => (
              <TableRow key={incident.RowNumber}>
                <TableCell>{dayjs(incident.Datum).format('LL')}</TableCell>
                <TableCell>{incident.VerkennerNaam}</TableCell>
                <TableCell>
                  {incident.Type === 'late' ? translate('late') : incident.Type === 'uniform' ? translate('forgotUniform') : translate('uniformOrLate')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TraktatieOverzicht />
    </Box>
  );
};

export default IncidentenOverzicht;