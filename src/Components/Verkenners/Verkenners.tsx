import { useEffect, useMemo, useState } from 'react';
import { Chip, IconButton, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import Edit from '@mui/icons-material/Edit';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import Description from '@mui/icons-material/Description';
import FolderOpen from '@mui/icons-material/FolderOpen';
import { useApplication } from '../ApplicationContext/useApplication';
import type { Verkenner } from '../../Types';
import { getCwoColor, getVletColor } from '../../utils';

const functieOrder = ['Bootsman', 'Kwartiermeester', 'Bakspik'];

const Verkenners = () => {
    const { apiFetch, translate, accessToken } = useApplication();
    const [pickerReady, setPickerReady] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => window.gapi.load('picker', { callback: () => setPickerReady(true) });
        document.body.appendChild(script);
        return () => script.remove();
    }, []);

    const pickStamkaart = () => {
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
        if (!apiKey || !accessToken || !window.google?.picker) {
            return;
        }
        new window.google.picker.PickerBuilder()
            .addView(window.google.picker.ViewId.DOCS)
            .setOAuthToken(accessToken)
            .setDeveloperKey(apiKey)
            .setCallback((response) => {
                if (response.action === window.google.picker.Action.PICKED) {
                    const url = response.docs?.[0]?.url;
                    if (url) {
                        setDraft((current) => ({ ...current, Document: url }));
                    }
                }
            })
            .build()
            .setVisible(true);
    };
    const [verkenners, setVerkenners] = useState<Verkenner[]>([]);
    const [functieOptions, setFunctieOptions] = useState<string[]>([]);
    const [cwoOptions, setCwoOptions] = useState<string[]>([]);
    const [vletOptions, setVletOptions] = useState<string[]>([]);
    const [editingId, setEditingId] = useState<number>();
    const [draft, setDraft] = useState<{ Functie: string; CWO: string; Vlet: string; Document: string }>({ Functie: '', CWO: '', Vlet: '', Document: '' });

    useEffect(() => {
        const loadVerkenners = async () => {
            const response = await apiFetch<Verkenner[]>('/api/meta/verkenners');
            if (response.status === 200) {
                setVerkenners(response.data);
            }
        };
        const loadOptions = async () => {
            const response = await apiFetch<{ cwoOptions: string[]; vletOptions: string[]; functieOptions: string[] }>('/api/meta/verkenner-options');
            if (response.status === 200) {
                setCwoOptions(response.data.cwoOptions);
                setVletOptions(response.data.vletOptions);
                setFunctieOptions(response.data.functieOptions);
            }
        };
        loadVerkenners();
        loadOptions();
    }, [apiFetch]);

    const sortedVerkenners = useMemo(() => {
        const functieRank = (functie?: string) => {
            const index = functieOrder.indexOf(functie ?? '');
            return index === -1 ? functieOrder.length : index;
        };
        return [...verkenners].sort((a, b) => {
            const boatDiff = (a.Vlet ?? '').localeCompare(b.Vlet ?? '');
            if (boatDiff !== 0) {
                return boatDiff;
            }
            const functieDiff = functieRank(a.Functie) - functieRank(b.Functie);
            if (functieDiff !== 0) {
                return functieDiff;
            }
            return a.Naam.localeCompare(b.Naam);
        });
    }, [verkenners]);

    const startEdit = (verkenner: Verkenner) => {
        setEditingId(verkenner.VerkennerId);
        setDraft({ Functie: verkenner.Functie ?? '', CWO: verkenner.CWO ?? '', Vlet: verkenner.Vlet ?? '', Document: verkenner.Document ?? '' });
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
                            <TableCell>{translate('function')}</TableCell>
                            <TableCell>{translate('qualification')}</TableCell>
                            <TableCell>{translate('boat')}</TableCell>
                            <TableCell>{translate('document')}</TableCell>
                            <TableCell align="right">{translate('editScout')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedVerkenners.map((verkenner) => {
                            const isEditing = editingId === verkenner.VerkennerId;
                            return (
                                <TableRow key={verkenner.VerkennerId}>
                                    <TableCell>{verkenner.Naam}</TableCell>
                                    <TableCell>
                                        {isEditing ? (
                                            <Select
                                                size="small"
                                                value={draft.Functie}
                                                onChange={(event) => setDraft((current) => ({ ...current, Functie: event.target.value }))}
                                                displayEmpty
                                            >
                                                <MenuItem value="">-</MenuItem>
                                                {functieOptions.map((option) => (
                                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                                ))}
                                            </Select>
                                        ) : verkenner.Functie || '-'}
                                    </TableCell>
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
                                    <TableCell>
                                        {isEditing ? (
                                            <>
                                                <TextField
                                                    size="small"
                                                    type="url"
                                                    placeholder={translate('documentLink')}
                                                    value={draft.Document}
                                                    onChange={(event) => setDraft((current) => ({ ...current, Document: event.target.value }))}
                                                />
                                                <IconButton aria-label={translate('pickStamkaart')} onClick={pickStamkaart} disabled={!pickerReady}>
                                                    <FolderOpen />
                                                </IconButton>
                                            </>
                                        ) : verkenner.Document ? (
                                            <IconButton
                                                component="a"
                                                href={verkenner.Document}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={translate('openDocument')}
                                            >
                                                <Description />
                                            </IconButton>
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
