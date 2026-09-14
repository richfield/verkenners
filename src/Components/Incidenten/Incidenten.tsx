import { useCallback, useEffect, useState } from 'react';
import { Alert, Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useApplication } from '../ApplicationContext/useApplication';
import type { IncidentType, Opkomst, Traktatie } from '../../Types';

const Incidenten = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apiFetch, verkenners, translate } = useApplication();
  const [opkomst, setOpkomst] = useState<Opkomst>();
  const [selectedScout, setSelectedScout] = useState('');
  const [incidentType, setIncidentType] = useState<IncidentType>('late');
  const [traktaties, setTraktaties] = useState<Traktatie[]>([]);
  const [message, setMessage] = useState('');

  const loadTraktaties = useCallback(async () => {
    const response = await apiFetch<Traktatie[]>('/api/opkomsten/traktaties');
    if (response.status === 200) {
      setTraktaties(response.data);
    }
  }, [apiFetch]);

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        const response = await apiFetch<Opkomst>(`/api/opkomsten/${id}`);
        if (response.status === 200) {
          setOpkomst(response.data);
        }
      }
      await loadTraktaties();
    };
    loadData();
  }, [apiFetch, id, loadTraktaties]);

  const recordIncident = async () => {
    if (!selectedScout || !opkomst?.Op) {
      return;
    }
    const response = await apiFetch('/api/opkomsten/incidents', 'POST', {
      date: new Date(opkomst.Op).toISOString(),
      verkennerNaam: selectedScout,
      type: incidentType,
    });
    if (response.status === 201) {
      setMessage(translate('incidentSaved'));
      setSelectedScout('');
      await loadTraktaties();
    }
  };

  const markDone = async (treat: Traktatie, done: boolean) => {
    const response = await apiFetch(`/api/opkomsten/traktaties/${treat.RowNumber}`, 'PUT', { done });
    if (response.status === 200) {
      setTraktaties((current) => current.map((item) => item.RowNumber === treat.RowNumber ? { ...item, Getrakteerd: done } : item));
    }
  };

  const dueTraktaties = traktaties.filter((item) => item.KerenOver === 0 && item.AantalKeerVergeten > 0 && !item.Getrakteerd);

  return (
    <Box sx={{ p: 3, maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>{translate('incidentsAndTreats')}</Typography>
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

      <Box component="section" sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>{translate('recordIncident')}</Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>{translate('scout')}</InputLabel>
          <Select value={selectedScout} label={translate('scout')} onChange={(event) => setSelectedScout(event.target.value)}>
            {verkenners.map((scout) => <MenuItem key={scout.VerkennerId} value={scout.Naam}>{scout.Naam}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>{translate('incidentType')}</InputLabel>
          <Select value={incidentType} label={translate('incidentType')} onChange={(event) => setIncidentType(event.target.value as IncidentType)}>
            <MenuItem value="late">{translate('late')}</MenuItem>
            <MenuItem value="uniform">{translate('forgotUniform')}</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={recordIncident} disabled={!selectedScout || !opkomst?.Op}>
          {translate('record')}
        </Button>
      </Box>

      <Box component="section">
        <Typography variant="h6" gutterBottom>{translate('needsTreat')}</Typography>
        {dueTraktaties.length === 0 && <Typography>{translate('noTreats')}</Typography>}
        {dueTraktaties.map((treat) => (
          <FormControlLabel
            key={treat.RowNumber}
            control={<Checkbox checked={treat.Getrakteerd} onChange={(event) => markDone(treat, event.target.checked)} />}
            label={`${treat.VerkennerNaam} (${treat.AantalKeerVergeten} ${translate('times')})`}
          />
        ))}
      </Box>

      <Button sx={{ mt: 3 }} onClick={() => navigate(-1)}>{translate('back')}</Button>
    </Box>
  );
};

export default Incidenten;