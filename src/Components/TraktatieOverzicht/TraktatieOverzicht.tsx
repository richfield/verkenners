import { useEffect, useState } from 'react';
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useApplication } from '../ApplicationContext/useApplication';
import type { Traktatie } from '../../Types';

const TraktatieOverzicht = () => {
    const { apiFetch, translate } = useApplication();
    const [traktaties, setTraktaties] = useState<Traktatie[]>([]);
    const [checkedRows, setCheckedRows] = useState<number[]>([]);

    useEffect(() => {
        const loadTraktaties = async () => {
            const response = await apiFetch<Traktatie[]>('/api/opkomsten/traktaties');
            if (response.status === 200) {
                setTraktaties(response.data);
            }
        };
        loadTraktaties();
    }, [apiFetch]);

    const dueTraktaties = traktaties.filter((item) => Math.floor(item.AantalKeerVergeten / 3) > item.Getrakteerd || checkedRows.includes(item.RowNumber));
    const markDone = async (treat: Traktatie) => {
        setCheckedRows((current) => current.includes(treat.RowNumber) ? current : [...current, treat.RowNumber]);
        const response = await apiFetch(`/api/opkomsten/traktaties/${treat.RowNumber}`, 'PUT');
        if (response.status === 200) {
            setTraktaties((current) => current.map((item) => item.RowNumber === treat.RowNumber ? { ...item, Getrakteerd: item.Getrakteerd + 1 } : item));
        } else {
            setCheckedRows((current) => current.filter((rowNumber) => rowNumber !== treat.RowNumber));
        }
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
                                checked={checkedRows.includes(treat.RowNumber)}
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