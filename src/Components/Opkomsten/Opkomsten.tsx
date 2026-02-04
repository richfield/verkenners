// src/pages/HomePage.tsx
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useApplication } from '../ApplicationContext/useApplication';
import type { Opkomst } from '../../Types';
import { getNaam, getNamen } from '../../utils';
import { Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const Opkomsten = () => {
    const navigate = useNavigate();
    const { apiFetch } = useApplication();
    const [sheetData, setSheetData] = useState<Opkomst[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const opkomsten = await apiFetch<Opkomst[]>("/api/opkomsten/list", "POST", { history : false });
            if (opkomsten.status == 200) {
                setSheetData(opkomsten.data);
            }
        };
        fetchData();
    }, [apiFetch]);

    const goToEdit = (opkomstId: number): void => {
        navigate(`/opkomsten/${opkomstId}/edit`);
    };
    return (
        <Box sx={{ p: 3 }}>
            {sheetData && (
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {["", "Op", "Tot", "Omschrijving", "Opmerkingen", "SvdD", "Leiding Aanwezig", "Leiding Afwezig", "Afwezig", "Eerder weg"].map((header: string, index: number) => (
                                    <TableCell key={index}>{header}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sheetData.map((opkomst: Opkomst, rowIndex: number) => {
                                return (
                                    <TableRow key={rowIndex}>
                                        <TableCell>
                                            <IconButton onClick={() => goToEdit(opkomst.OpkomstId)}>
                                                <Edit />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>{dayjs(opkomst.Op).format("LL")}</TableCell>
                                        <TableCell>{opkomst.Tot ? dayjs(opkomst.Tot)?.format("LL") : ""}</TableCell>
                                        <TableCell>{opkomst.Omschrijving}</TableCell>
                                        <TableCell>{opkomst.Opmerkingen}</TableCell>
                                        <TableCell>{getNaam(opkomst.StuurmanVanDeDag)}</TableCell>
                                        <TableCell>{getNamen(opkomst.LeidingAanwezig)}</TableCell>
                                        <TableCell>{getNamen(opkomst.LeidingAfwezig)}</TableCell>
                                        <TableCell>{getNamen(opkomst.VerkennerAfwezig)}</TableCell>
                                        <TableCell>{getNamen(opkomst.EerderWeg)}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default Opkomsten;
