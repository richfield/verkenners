import { useEffect, useState } from 'react';
import { Alert, Box, Button, Checkbox, FormControl, InputLabel, MenuItem, Select, Typography, type SelectChangeEvent } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useApplication } from '../ApplicationContext/useApplication';
import type { IncidentType, Opkomst } from '../../Types';

const Incidenten = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apiFetch, verkenners, translate } = useApplication();
  const [opkomst, setOpkomst] = useState<Opkomst>();
  const [selectedScouts, setSelectedScouts] = useState<string[]>([]);
  const [incidentType, setIncidentType] = useState<IncidentType>('late');
  const [message, setMessage] = useState('');


  useEffect(() => {
    const loadData = async () => {
      if (id) {
        const response = await apiFetch<Opkomst>(`/api/opkomsten/${id}`);
        if (response.status === 200) {
          setOpkomst(response.data);
        }
      }
    };
    loadData();
  }, [apiFetch, id]);

  const recordIncident = async () => {
    if (selectedScouts.length === 0 || !opkomst?.Op) {
      return;
    }
    const response = await apiFetch('/api/opkomsten/incidents', 'POST', {
      date: new Date(opkomst.Op).toISOString(),
      verkennerNamen: selectedScouts,
      type: incidentType,
    });
    if (response.status === 201) {
      setMessage(translate('incidentSaved'));
      setSelectedScouts([]);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>{translate('incidentsAndTreats')}</Typography>
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

      <Box component="section" sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>{translate('recordIncident')}</Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>{translate('scout')}</InputLabel>
          <Select<string[]>
            multiple
            value={selectedScouts}
            label={translate('scout')}
            onChange={(event: SelectChangeEvent<string[]>) => setSelectedScouts(event.target.value as string[])}
            renderValue={(selected: string[]) => selected.join(', ')}
          >
            {verkenners.map((scout) => (
              <MenuItem key={scout.VerkennerId} value={scout.Naam}>
                <Checkbox checked={selectedScouts.includes(scout.Naam)} />
                {scout.Naam}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>{translate('incidentType')}</InputLabel>
          <Select value={incidentType} label={translate('incidentType')} onChange={(event) => setIncidentType(event.target.value as IncidentType)}>
            <MenuItem value="late">{translate('late')}</MenuItem>
            <MenuItem value="uniform">{translate('forgotUniform')}</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={recordIncident} disabled={selectedScouts.length === 0 || !opkomst?.Op}>
          {translate('record')}
        </Button>
      </Box>
      <Button sx={{ mt: 3 }} onClick={() => navigate(-1)}>{translate('back')}</Button>
    </Box>
  );
};

export default Incidenten;