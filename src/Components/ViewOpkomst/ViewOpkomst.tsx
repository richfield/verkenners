import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApplication } from "../ApplicationContext/useApplication";
import type { Opkomst } from '../../Types';
import Grid from "@mui/material/Grid";
import { Card, CardActions, CardContent, CardHeader, IconButton, Typography } from "@mui/material";
import { Add, ArrowLeft, ArrowRight, Edit } from "@mui/icons-material";
import dayjs from "dayjs";
import BorderTitleBox from "../BorderTitleBox";
import SaturdayOnlyCalendar from "../SaturdayOnlyCalendar";
import type { DateEntry } from "../DateEntry";
import TraktatieOverzicht from "../TraktatieOverzicht/TraktatieOverzicht";

const ViewOpkomst = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [opkomstId, setOpkomstId] = useState(id ? parseInt(id) : -1);
    const { apiFetch, leiding, verkenners, translate } = useApplication();
    const [opkomst, setOpkomst] = useState<Opkomst>();

    useEffect(() => {
        const getActiveOpkomst = async () => {
            if (opkomstId && opkomstId !== opkomst?.OpkomstId) {
                const response = await apiFetch<Opkomst>(`/api/opkomsten/${opkomstId}`);
                if (response.status === 200) {
                    setOpkomst(response.data);
                    setOpkomstId(response.data.OpkomstId);
                }
            }
        };
        getActiveOpkomst();
    }, [opkomstId, apiFetch, opkomst?.OpkomstId]);

    const goBack = () => {
        setOpkomstId(opkomstId - 1);
    };

    const goForward = () => {
        setOpkomstId(opkomstId + 1);
    };

    if (!opkomst || leiding.length === 0 || verkenners.length === 0) {
        return <></>;
    }

    const calenderPicked = (selected: DateEntry): void => {
        if (selected?.OpkomstId && selected.OpkomstId !== opkomstId) {
            setOpkomstId(selected.OpkomstId);
        }
    };

    return (<Grid>
        <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{ padding: 2, backgroundColor: 'background.paper' }}
        >
            <Grid>
                <IconButton onClick={goBack} aria-label={translate('back')}>
                    <ArrowLeft />
                </IconButton>
            </Grid>
            <Grid>
                <SaturdayOnlyCalendar onChange={calenderPicked} />
            </Grid>
            <Grid>
                <IconButton onClick={goForward} aria-label={translate('forward')}>
                    <ArrowRight />
                </IconButton>
            </Grid>
        </Grid>
        <Grid
            container
            alignItems="center"
            sx={{ padding: 2, backgroundColor: 'background.paper' }}
        >
            <Card sx={{ minWidth: "100%" }}>
                <CardHeader
                    title={
                        `${dayjs(opkomst.Op).format('LL')} ${opkomst.Tot ? `- ${dayjs(opkomst.Tot).format('LL')}` : ''}`
                    }
                    subheader={opkomst.Omschrijving}
                />
                <CardContent>
                    <Grid>
                        <Grid sx={{ paddingBottom: 1.5 }}>
                            <BorderTitleBox title={translate('leader')}>
                                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{translate('leaderOfTheDay')}: {opkomst.StuurmanVanDeDag?.Naam}</Typography>
                                <Typography variant="body2">{translate('absent')}: {opkomst.LeidingAfwezig.map(m => m.Naam).join(', ')}</Typography>
                            </BorderTitleBox>
                        </Grid>

                        <Grid sx={{ paddingBottom: 1.5 }}>
                            <BorderTitleBox title={translate('explorers')}>
                                <Typography variant="body2">{translate('absent')}: {opkomst.VerkennerAfwezig.map(m => m.Naam).join(', ')}</Typography>
                                <Typography variant="body2">{translate('leaveEarly')}: {opkomst.EerderWeg.map(m => m.Naam).join(', ')}</Typography>
                            </BorderTitleBox>
                        </Grid>

                        <Grid>
                            <Typography variant="body2">{opkomst.Opmerkingen}</Typography>
                        </Grid>
                        <TraktatieOverzicht />
                    </Grid>
                </CardContent>
                <CardActions>
                    <IconButton onClick={() => navigate(`/opkomsten/${opkomstId}/edit`)} aria-label={translate('editAttendance')}>
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => navigate(`/opkomsten/${opkomstId}/incidenten`)} aria-label={translate('addIncident')}>
                        <Add />
                    </IconButton>
                </CardActions>
            </Card>
        </Grid>
    </Grid>
    );
};

export default ViewOpkomst;
