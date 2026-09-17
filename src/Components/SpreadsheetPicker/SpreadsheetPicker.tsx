import { useEffect, useState } from 'react';
import { Alert, Box, Button, Typography } from '@mui/material';
import { useApplication } from '../ApplicationContext/useApplication';

type PickerDocument = { id?: string };
type PickerResponse = { action?: string; docs?: PickerDocument[] };
type Picker = { setVisible: (visible: boolean) => void };
type PickerBuilder = {
    addView: (view: unknown) => PickerBuilder;
    setOAuthToken: (token: string) => PickerBuilder;
    setDeveloperKey: (key: string) => PickerBuilder;
    setCallback: (callback: (response: PickerResponse) => void) => PickerBuilder;
    build: () => Picker;
};
type GooglePicker = {
    PickerBuilder: new () => PickerBuilder;
    ViewId: { SPREADSHEETS: string };
    Action: { PICKED: string };
};
type GoogleApi = { load: (api: string, callback: { callback: () => void }) => void };

declare global {
    interface Window {
        gapi: GoogleApi;
        google: { picker: GooglePicker };
    }
}

const SpreadsheetPicker = () => {
    const { accessToken, selectSpreadsheet, translate } = useApplication();
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<'apiKey' | 'script' | null>(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => window.gapi.load('picker', { callback: () => setReady(true) });
        script.onerror = () => setError('script');
        document.body.appendChild(script);
        return () => script.remove();
    }, []);

    const openPicker = () => {
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
        if (!apiKey) {
            setError('apiKey');
            return;
        }
        if (!accessToken || !window.google?.picker) {
            setError('script');
            return;
        }
        const picker = new window.google.picker.PickerBuilder()
            .addView(window.google.picker.ViewId.SPREADSHEETS)
            .setOAuthToken(accessToken)
            .setDeveloperKey(apiKey)
            .setCallback((response) => {
                if (response.action === window.google.picker.Action.PICKED) {
                    const id = response.docs?.[0]?.id;
                    if (id) {
                        selectSpreadsheet(id);
                    }
                }
            })
            .build();
        picker.setVisible(true);
    };

    return (
        <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>{translate('selectSpreadsheet')}</Typography>
            <Typography sx={{ mb: 2 }}>{translate('selectSpreadsheetDescription')}</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{translate(error === 'apiKey' ? 'spreadsheetPickerApiKeyError' : 'spreadsheetPickerError')}</Alert>}
            <Button variant="contained" onClick={openPicker} disabled={!ready}>
                {translate('chooseSpreadsheet')}
            </Button>
        </Box>
    );
};

export default SpreadsheetPicker;
