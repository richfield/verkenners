// src/components/WijzigOpkomst.tsx
import { useEffect, useState } from 'react';
import { TextField, Button, Box, Typography, Select, type SelectChangeEvent, OutlinedInput, MenuItem, InputLabel, FormControl, ListItemText, Checkbox } from '@mui/material';
import { useApplication } from '../ApplicationContext/useApplication';
import type { Opkomst } from '../../Types';
import { useNavigate, useParams } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import type { PickerValue } from '@mui/x-date-pickers/internals';
import ClearIcon from '@mui/icons-material/Clear';
import Grid from '@mui/material/Grid';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const WijzigOpkomst = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const opkomstId = id && parseInt(id);
    const { apiFetch, leiding, verkenners } = useApplication();
    const [opkomst, setOpkomst] = useState<Opkomst>();
    const [selectedOpDate, setSelectedOpDate] = useState<Dayjs | null>(null);
    const [selectedTotDate, setSelectedTotDate] = useState<Dayjs | null>(null);

    useEffect(() => {
        const getActiveOpkomst = async () => {
            if (opkomstId) {
                const response = await apiFetch<Opkomst>(`/api/opkomsten/${opkomstId}`);
                if (response.status === 200) {
                    setOpkomst(response.data);
                    setSelectedOpDate(response.data.Op ? dayjs(response.data.Op) : null);
                    setSelectedTotDate(response.data.Tot ? dayjs(response.data.Tot) : null);
                }
            }
        };
        getActiveOpkomst();
    }, [opkomstId, apiFetch]);

    if (!opkomst || leiding.length === 0 || verkenners.length === 0) {
        return <></>;
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (opkomst.OpkomstId) {
            setOpkomst((prevOpkomst) => {
                if (prevOpkomst) {
                    return {
                        ...prevOpkomst,
                        [name]: name === 'Op' || name === 'Tot' ? new Date(value) : value,
                    };
                }
                return;
            });
        }

    };

    const handleSubmit = async () => {
        if (opkomstId) {
            try {
                await apiFetch(`/api/opkomsten/${opkomstId}`, "PUT", JSON.stringify(opkomst));
                navigate(-1);
            } catch (error) {
                console.error('Fout bij opslaan:', error);
            }
        }
    };

    const handleOpDateChange = (value: PickerValue) => {
        if (value) {
            setOpkomst((prevOpkomst) => {
                if (prevOpkomst) {
                    return {
                        ...prevOpkomst,
                        Op: value?.toDate(),
                    };
                }
                return;
            });
            setSelectedOpDate(value);
        }
    };

    const handleTotDateChange = (value: PickerValue) => {
        if (value) {
            setOpkomst((prevOpkomst) => {
                if (prevOpkomst) {
                    return {
                        ...prevOpkomst,
                        Tot: value?.toDate(),
                    };
                }
                return;
            });
            setSelectedTotDate(value);
        }
    };
    const clearOpDate = () => {
        setOpkomst((prevOpkomst) => {
            if (prevOpkomst) {
                return {
                    ...prevOpkomst,
                    Op: undefined,
                };
            }
            return;
        });
        setSelectedOpDate(null);
    };
    const clearTotDate = () => {
        setOpkomst((prevOpkomst) => {
            if (prevOpkomst) {
                return {
                    ...prevOpkomst,
                    Tot: undefined,
                };
            }
            return;
        });
        setSelectedTotDate(null);
    };

    const handleSvdDChange = (event: SelectChangeEvent<string>) => {
        const {
            target: { value }
        } = event;
        if (value) {
            const selectedLeiding = leiding.find(f => f.Naam === value);
            if (selectedLeiding) {
                setOpkomst((prevOpkomst) => {
                    if (prevOpkomst) {
                        return {
                            ...prevOpkomst,
                            StuurmanVanDeDag: selectedLeiding,
                        };
                    }
                    return;
                });
            }
        }
    };

    const handleSelectLeidingChange = (event: SelectChangeEvent<string[]>): void => {
        const {
            target: { value, name }
        } = event;
        if (value) {
            const selectedLeiding = leiding.filter(f => (value as string[]).includes(f.Naam));
            if (selectedLeiding) {
                setOpkomst((prevOpkomst) => {
                    if (prevOpkomst) {
                        return {
                            ...prevOpkomst,
                            [name]: selectedLeiding,
                        };
                    }
                    return;
                });
            }
        }
    };

    const handleSelectVerkennerChange = (event: SelectChangeEvent<string[]>): void => {
        const {
            target: { value, name }
        } = event;
        if (value) {
            const selectedVerkenner = verkenners.filter(f => (value as string[]).includes(f.Naam));
            if (selectedVerkenner) {
                setOpkomst((prevOpkomst) => {
                    if (prevOpkomst) {
                        return {
                            ...prevOpkomst,
                            [name]: selectedVerkenner,
                        };
                    }
                    return;
                });
            }
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5">Opkomst Wijzigen</Typography>

            <Grid container spacing={2}>
                {/* Date Picker: Van */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <DatePicker
                            format='LL'
                            value={selectedOpDate}
                            onChange={handleOpDateChange}
                            slots={{ clearIcon: ClearIcon }}
                            slotProps={{
                                field: { clearable: true },
                                clearIcon: { onClick: clearOpDate },
                            }}
                        />
                    </FormControl>
                </Grid>

                {/* Date Picker: Tot */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <DatePicker
                            label="Tot"
                            format='LL'
                            value={selectedTotDate}
                            onChange={handleTotDateChange}
                            slots={{ clearIcon: ClearIcon }}
                            slotProps={{
                                field: { clearable: true },
                                clearIcon: { onClick: clearTotDate },
                            }}
                        />
                    </FormControl>
                </Grid>

                {/* Omschrijving */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <TextField
                            label="Omschrijving"
                            name="Omschrijving"
                            value={opkomst.Omschrijving}
                            onChange={handleChange}
                            margin="normal"
                        />
                    </FormControl>
                </Grid>

                {/* Opmerkingen */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <TextField
                            label="Opmerkingen"
                            name="Opmerkingen"
                            value={opkomst.Opmerkingen}
                            onChange={handleChange}
                            margin="normal"
                        />
                    </FormControl>
                </Grid>

                {/* Stuurman van de dag */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel id="stuurman-label">Stuurman van de dag</InputLabel>
                        <Select
                            label="Stuurman van de dag"
                            value={opkomst.StuurmanVanDeDag.Naam}
                            renderValue={(selected) => selected}
                            onChange={handleSvdDChange}
                            input={<OutlinedInput label="Selecteer namen" />}
                            MenuProps={MenuProps}
                        >
                            {leiding.map((l) => (
                                <MenuItem key={l.Naam} value={l.Naam}>
                                    {l.Naam}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Leiding Aanwezig */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel id="leiding-aanwezig-label">Leiding Aanwezig</InputLabel>
                        <Select
                            labelId="leiding-aanwezig-label"
                            id="leiding-aanwezig"
                            multiple
                            name="LeidingAanwezig"
                            value={opkomst.LeidingAanwezig.map(l => l.Naam)}
                            onChange={handleSelectLeidingChange}
                            input={<OutlinedInput label="Selecteer leiding" />}
                            renderValue={(selected) => (
                                selected
                                    .map((id) => leiding.find(l => l.Naam === id)?.Naam)
                                    .join(', ')
                            )}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 48 * 4.5 + 8,
                                        width: 250,
                                    },
                                },
                            }}
                        >
                            {leiding.map((l) => (
                                <MenuItem key={l.LeidingId} value={l.Naam}>
                                    <Checkbox checked={opkomst.LeidingAanwezig.some(a => a.Naam === l.Naam)} />
                                    <ListItemText primary={l.Naam} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Leiding Afwezig */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel id="leiding-afwezig-label">Leiding Afwezig</InputLabel>
                        <Select
                            labelId="leiding-afwezig-label"
                            id="leiding-afwezig"
                            multiple
                            name="LeidingAfwezig"
                            value={opkomst.LeidingAfwezig.map(l => l.Naam)}
                            onChange={handleSelectLeidingChange}
                            input={<OutlinedInput label="Selecteer leiding" />}
                            renderValue={(selected) => (
                                selected
                                    .map((id) => leiding.find(l => l.Naam === id)?.Naam)
                                    .join(', ')
                            )}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 48 * 4.5 + 8,
                                        width: 250,
                                    },
                                },
                            }}
                        >
                            {leiding.map((l) => (
                                <MenuItem key={l.LeidingId} value={l.Naam}>
                                    <Checkbox checked={opkomst.LeidingAfwezig.some(a => a.Naam === l.Naam)} />
                                    <ListItemText primary={l.Naam} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Verkenner Afwezig */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel id="verkenner-afwezig-label">Verkenner Afwezig</InputLabel>
                        <Select
                            labelId="verkenner-afwezig-label"
                            id="verkenner-afwezig"
                            multiple
                            name="VerkennerAfwezig"
                            value={opkomst.VerkennerAfwezig.map(v => v.Naam)}
                            onChange={handleSelectVerkennerChange}
                            input={<OutlinedInput label="Selecteer Verkenner" />}
                            renderValue={(selected) => (
                                selected
                                    .map((id) => verkenners.find(v => v.Naam === id)?.Naam)
                                    .join(', ')
                            )}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 48 * 4.5 + 8,
                                        width: 250,
                                    },
                                },
                            }}
                        >
                            {verkenners.map((v) => (
                                <MenuItem key={v.VerkennerId} value={v.Naam}>
                                    <Checkbox checked={opkomst.VerkennerAfwezig?.some(a => a.Naam === v.Naam)} />
                                    <ListItemText primary={v.Naam} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Eerder Weg */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel id="eerder-weg-label">Eerder weg</InputLabel>
                        <Select
                            labelId="eerder-weg-label"
                            id="eerder-weg"
                            multiple
                            name="EerderWeg"
                            value={opkomst.EerderWeg.map(v => v.Naam)}
                            onChange={handleSelectVerkennerChange}
                            input={<OutlinedInput label="Selecteer Verkenner" />}
                            renderValue={(selected) => (
                                selected
                                    .map((id) => verkenners.find(v => v.Naam === id)?.Naam)
                                    .join(', ')
                            )}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 48 * 4.5 + 8,
                                        width: 250,
                                    },
                                },
                            }}
                        >
                            {verkenners.map((v) => (
                                <MenuItem key={v.VerkennerId} value={v.Naam}>
                                    <Checkbox checked={opkomst.EerderWeg?.some(a => a.Naam === v.Naam)} />
                                    <ListItemText primary={v.Naam} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Submit Button */}

                <Grid size={{ xs: 12, sm: 6 }} justifyContent="center" display="flex">
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Opslaan
                    </Button>
                </Grid>
            </Grid>
        </Box>

    );
};

export default WijzigOpkomst;
