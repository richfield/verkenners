import { useEffect, useState } from 'react';
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useApplication } from '../ApplicationContext/useApplication';
import type { Traktatie } from '../../Types';

const TraktatieOverzicht = () => {
    const { apiFetch, translate } = useApplication();
    const [traktaties, setTraktaties] = useState<Traktatie[]>([]);
    const [pendingRows, setPendingRows] = useState<number[]>([]);

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
    const markDone = async (treat: Traktatie) => {
        // marks the row as pending so the native checkbox toggle doesn't get stuck checked while the request is in flight
        setPendingRows((current) => [...current, treat.RowNumber]);
        const response = await apiFetch(`/api/opkomsten/traktaties/${treat.RowNumber}`, 'PUT');
        if (response.status === 200) {
            setTraktaties((current) => current.map((item) => item.RowNumber === treat.RowNumber ? { ...item, Getrakteerd: item.Getrakteerd + 1 } : item));
        }
        setPendingRows((current) => current.filter((rowNumber) => rowNumber !== treat.RowNumber));
    };
    return (
        <Box component="section">
            <Typography variant="h6" gutterBottom>{translate('needsTreat')}</Typography>
            {dueTraktaties.length === 0 && <Typography>{translate('noTreats')}</Typography>}
            {dueTraktaties.map((treat) => (
                <Box key={treat.RowNumber} sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={false}
                                disabled={pendingRows.includes(treat.RowNumber)}
                                onChange={() => markDone(treat)}
                            />
                        }
                        label={`${treat.VerkennerNaam} (${treat.AantalKeerVergeten} ${translate('times')}, ${treat.Getrakteerd} ${translate('treatsSupplied')})`}
                    />
                </Box>
            ))}
        </Box>
    );
};

export default TraktatieOverzicht;