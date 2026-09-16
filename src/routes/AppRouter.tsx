// src/routes/AppRouter.tsx
import { Routes, Route } from 'react-router-dom';
import Opkomsten  from '../Components/Opkomsten/Opkomsten';
import Layout from '../Components/Layout/Layout';
import Login from '../Components/Login/Login';
import WijzigOpkomst from '../Components/WijzigOpkomst/WijzigOpkomst';
import TermsAndConditions from '../Components/TOS';
import PrivacyPolicy from '../Components/PP';
import ViewOpkomst from '../Components/ViewOpkomst/ViewOpkomst';
import Home from '../Components/Home/Home';
import Incidenten from '../Components/Incidenten/Incidenten';
import IncidentenOverzicht from '../Components/IncidentenOverzicht/IncidentenOverzicht';
import Verkenners from '../Components/Verkenners/Verkenners';

const AppRouter = () => {
  return (
      <Layout>
        <Routes>
          <Route path="/opkomsten/list" element={<Opkomsten />} />
          <Route path='/login' element={<Login/>} />
          <Route path="/opkomsten/:id/edit" element={<WijzigOpkomst />} />
          <Route path="/opkomsten/:id/incidenten" element={<Incidenten />} />
          <Route path="/incidenten" element={<IncidentenOverzicht />} />
          <Route path="/verkenners" element={<Verkenners />} />
          <Route path='/tos' element={<TermsAndConditions />} />
          <Route path='/pp' element={<PrivacyPolicy />} />
          <Route path="/opkomsten/:id" element={<ViewOpkomst />} />
          <Route path="/opkomsten/" element={<ViewOpkomst />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
  );
};

export default AppRouter;
