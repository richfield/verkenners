// src/routes/AppRouter.tsx
import { Routes, Route } from 'react-router-dom';
import Opkomsten  from '../Components/Opkomsten/Opkomsten';
import Layout from '../Components/Layout/Layout';
import Login from '../Components/Login/Login';
import WijzigOpkomst from '../Components/WijzigOpkomst/WijzigOpkomst';
import TermsAndConditions from '../Components/TOS';
import PrivacyPolicy from '../Components/PP';

const AppRouter = () => {
  return (
      <Layout>
        <Routes>
          <Route path="/" element={<Opkomsten />} />
          <Route path='/login' element={<Login/>} />
          <Route path="/opkomsten/:id/edit" element={<WijzigOpkomst />} />
          <Route path='/tos' element={<TermsAndConditions />} />
          <Route path='/pp' element={<PrivacyPolicy />} />
        </Routes>
      </Layout>
  );
};

export default AppRouter;
