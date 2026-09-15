import { useEffect, useState } from 'react';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Edit from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../ApplicationContext/useApplication';
import type { Verkenner } from '../../Types';

const Verkenners = () => {
    const navigate = useNavigate();
    const { apiFetch, translate } = useApplication();
    const [verkenners, setVerkenners] = useState<Verkenner[]>([]);

    useEffect(() => {
        const loadVerkenners = async () => {
            const response = await apiFetch<Verkenner[]>('/api/meta/verkenners');
            if (response.status === 200) {
                setVerkenners(response.data);
            }
        };
        loadVerkenners();
    }, [apiFetch]);

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
                        {verkenners.map((verkenner) => (
                            <TableRow key={verkenner.VerkennerId}>
                                <TableCell>{verkenner.Naam}</TableCell>
                                <TableCell>{verkenner.CWO || '-'}</TableCell>
                                <TableCell>{verkenner.Vlet || '-'}</TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        aria-label={translate('editScout')}
                                        onClick={() => navigate(`/verkenners/${verkenner.VerkennerId}/edit`)}
                                    >
                                        <Edit />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Verkenners;
