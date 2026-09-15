import { useState } from 'react';
import { Button, FormControl, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useApplication } from '../ApplicationContext/useApplication';
import type { Verkenner } from '../../Types';

const WijzigVerkenner = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { apiFetch, verkenners, translate } = useApplication();
    const verkennerId = Number(id);
    const sourceVerkenner = verkenners.find((item) => item.VerkennerId === verkennerId);
    const [draft, setDraft] = useState<Partial<Pick<Verkenner, 'CWO' | 'Vlet'>>>({});
    const verkenner = sourceVerkenner ? { ...sourceVerkenner, ...draft } : undefined;

    const updateField = (field: 'CWO' | 'Vlet', value: string) => {
        setDraft((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!verkenner) {
            return;
        }
        const response = await apiFetch(`/api/meta/verkenners/${verkenner.VerkennerId}`, 'PUT', {
            CWO: verkenner.CWO ?? '',
            Vlet: verkenner.Vlet ?? '',
        });
        if (response.status === 200) {
            navigate('/verkenners');
        }
    };

    if (!verkenner) {
        return <></>;
    }

    return (
        <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
            <Typography variant="h5" gutterBottom>{translate('editScout')}: {verkenner.Naam}</Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                    label={translate('qualification')}
                    value={verkenner.CWO ?? ''}
                    onChange={(event) => updateField('CWO', event.target.value)}
                />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                    label={translate('boat')}
                    value={verkenner.Vlet ?? ''}
                    onChange={(event) => updateField('Vlet', event.target.value)}
                />
            </FormControl>
            <Button variant="contained" onClick={handleSubmit} sx={{ mr: 1 }}>
                {translate('save')}
            </Button>
            <Button onClick={() => navigate('/verkenners')}>
                {translate('back')}
            </Button>
        </div>
    );
};

export default WijzigVerkenner;
