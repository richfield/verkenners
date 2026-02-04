// src/routes/AppRouter.tsx
import { Routes, Route } from 'react-router-dom';
import Opkomsten  from '../Components/Opkomsten/Opkomsten';
import Layout from '../Components/Layout/Layout';
import Login from '../Components/Login/Login';
import WijzigOpkomst from '../Components/WijzigOpkomst/WijzigOpkomst';

const AppRouter = () => {
  return (
      <Layout>
        <Routes>
          <Route path="/" element={<Opkomsten />} />
          <Route path='/login' element={<Login/>} />
          <Route path="/opkomsten/:id/edit" element={<WijzigOpkomst />} />
        </Routes>
      </Layout>
  );
};

export default AppRouter;
