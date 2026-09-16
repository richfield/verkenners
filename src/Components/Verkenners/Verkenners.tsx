import { useEffect, useState } from 'react';
import { Chip, IconButton, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Edit from '@mui/icons-material/Edit';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import { useApplication } from '../ApplicationContext/useApplication';
import type { Verkenner } from '../../Types';
import { getCwoColor, getVletColor } from '../../utils';

const Verkenners = () => {
    const { apiFetch, translate } = useApplication();
    const [verkenners, setVerkenners] = useState<Verkenner[]>([]);
    const [cwoOptions, setCwoOptions] = useState<string[]>([]);
    const [vletOptions, setVletOptions] = useState<string[]>([]);
    const [editingId, setEditingId] = useState<number>();
    const [draft, setDraft] = useState<{ CWO: string; Vlet: string }>({ CWO: '', Vlet: '' });

    useEffect(() => {
        const loadVerkenners = async () => {
            const response = await apiFetch<Verkenner[]>('/api/meta/verkenners');
            if (response.status === 200) {
                setVerkenners(response.data);
            }
        };
        const loadOptions = async () => {
            const response = await apiFetch<{ cwoOptions: string[]; vletOptions: string[] }>('/api/meta/verkenner-options');
            if (response.status === 200) {
                setCwoOptions(response.data.cwoOptions);
                setVletOptions(response.data.vletOptions);
            }
        };
        loadVerkenners();
        loadOptions();
    }, [apiFetch]);

    const startEdit = (verkenner: Verkenner) => {
        setEditingId(verkenner.VerkennerId);
        setDraft({ CWO: verkenner.CWO ?? '', Vlet: verkenner.Vlet ?? '' });
    };

    const cancelEdit = () => {
        setEditingId(undefined);
    };

    const saveEdit = async (verkennerId: number) => {
        const response = await apiFetch(`/api/meta/verkenners/${verkennerId}`, 'PUT', draft);
        if (response.status === 200) {
            setVerkenners((current) => current.map((item) => item.VerkennerId === verkennerId ? { ...item, ...draft } : item));
            setEditingId(undefined);
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Typography variant="h5" gutterBottom>{translate('scouts')}</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{translate('scout')}</TableCell>
                            <TableCell>{translate('qualification')}</TableCell>
                            <TableCell>{translate('boat')}</TableCell>
                            <TableCell align="right">{translate('editScout')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {verkenners.map((verkenner) => {
                            const isEditing = editingId === verkenner.VerkennerId;
                            return (
                                <TableRow key={verkenner.VerkennerId}>
                                    <TableCell>{verkenner.Naam}</TableCell>
                                    <TableCell>
                                        {isEditing ? (
                                            <Select
                                                size="small"
                                                value={draft.CWO}
                                                onChange={(event) => setDraft((current) => ({ ...current, CWO: event.target.value }))}
                                                displayEmpty
                                            >
                                                <MenuItem value="">-</MenuItem>
                                                {cwoOptions.map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        <Chip label={option} size="small" sx={{ backgroundColor: getCwoColor(option), color: '#fff' }} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        ) : verkenner.CWO ? (
                                            <Chip label={verkenner.CWO} size="small" sx={{ backgroundColor: getCwoColor(verkenner.CWO), color: '#fff' }} />
                                        ) : '-'}
                                    </TableCell>
                                    <TableCell>
                                        {isEditing ? (
                                            <Select
                                                size="small"
                                                value={draft.Vlet}
                                                onChange={(event) => setDraft((current) => ({ ...current, Vlet: event.target.value }))}
                                                displayEmpty
                                            >
                                                <MenuItem value="">-</MenuItem>
                                                {vletOptions.map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        <Chip label={option} size="small" sx={{ backgroundColor: getVletColor(option), color: '#fff' }} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        ) : verkenner.Vlet ? (
                                            <Chip label={verkenner.Vlet} size="small" sx={{ backgroundColor: getVletColor(verkenner.Vlet), color: '#fff' }} />
                                        ) : '-'}
                                    </TableCell>
                                    <TableCell align="right">
                                        {isEditing ? (
                                            <>
                                                <IconButton aria-label={translate('save')} onClick={() => saveEdit(verkenner.VerkennerId)}>
                                                    <Check />
                                                </IconButton>
                                                <IconButton aria-label={translate('back')} onClick={cancelEdit}>
                                                    <Close />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <IconButton aria-label={translate('editScout')} onClick={() => startEdit(verkenner)}>
                                                <Edit />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Verkenners;
