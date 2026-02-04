// src/App.tsx
import './App.css';
//import { useApplication } from './Components/ApplicationContext/useApplication';
import AppRouter from './routes/AppRouter';
// import * as sheetService from './service/sheetService';
// import { useEffect } from 'react';

function App() {
  //const { accessToken } = useApplication();

  // useEffect(() => {
  //   if (accessToken) {
  //     const range = "Opkomsten!A1:Z1000";
  //     sheetService.readSheetData(accessToken, range)
  //       .then((data) => console.log('Sheet data:', data))
  //       .catch((error) => console.error('Error reading sheet:', error));
  //   }
  // }, [accessToken]);

  return <AppRouter />
}

export default App;
