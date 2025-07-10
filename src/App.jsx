import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './features/auth/login';

import DashboardLayout from './components/Dashboard';
import DashboardHome from './components/DashboardHome';
import ProtectedRoute from './components/ProtectedRoute';

import  PromotersList  from './Features/Promoters/ListsPromoters';
import { PromotorFormPage } from "./Features/Promoters/FormPromotor";
import { PromotorDetail } from './Features/Promoters/DetailPromotor';

import BrokersList from './Features/Brokers/ListsBrokers';
import { BrokerFormPage } from './Features/Brokers/FormBrokers';

import ComAgentsLists from './Features/Commission_Agents/ListsComAgents';
import { ComAgentsForm } from './Features/Commission_Agents/FormComAgents';

import { CustomersPage } from "./pages/CustomerPage";
import { CustomerFormPage } from "./components/Customers/FormCustomer";

import LayoutMovimientos from './components/Tesoreria/LayoutMovimientos';
import { TreasuryPage } from './pages/TreasuryPage';
import { SolicitudFormPage } from './components/Tesoreria/SolicitudFormPage';

import Sidebar from './components/Sidebar';
import { RequestsList } from './components/Tesoreria/ListsRequests';
import Layout from './components/Tesoreria/Layout';
import { Movements } from './components/Tesoreria/Movements';
import { Balances } from './components/Balances/Balances_Sidebar';

import { CompaniesList } from './components/Companies/ListsCompanies';

import { EquipmentList } from './components/Equipments/ListsEquipment';
import { EquipmentsFormPage } from './components/Equipments/FormEquipments';


function App() {
  return (
    <Router>

      
      <Routes>
      
        <Route path="/" element={<Login />} />
        {/* <Route path="/login" element={<LoginForm />} /> */}
        

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
        }>

          <Route index element={<DashboardHome />} />
          <Route path="promotores" element={<PromotersList/>} />
          <Route path="promotor" element={<PromotorFormPage/>} />
          <Route path="promotor/:id" element={<PromotorFormPage/>} />
          <Route path="promotordetail/:id" element={<PromotorDetail/>} />
          
          <Route path="brokers" element={<BrokersList />} />
          <Route path="broker" element={<BrokerFormPage/>} />
          <Route path="broker/:id" element={<BrokerFormPage/>} />

          <Route path="comisionistas" element={<ComAgentsLists />} />
          <Route path="comisionista" element={<ComAgentsForm/>} />
          <Route path="comisionista/:id" element={<ComAgentsForm/>} />

          <Route path="customers" element={<CustomersPage/>} />
          <Route path="customer" element={<CustomerFormPage/>} />
          <Route path="customer/:id" element={<CustomerFormPage/>} />

          <Route path="equipments/equipments" element={< EquipmentList />} />
          <Route path="equipments/equipment" element={< EquipmentsFormPage />} />
          <Route path="equipments/equipment/:id" element={< EquipmentsFormPage />} />

          { /*<Route path="treasury/movements/*" element={<TreasuryPage/>} /> */}
          <Route path="treasury/movements/*" element={<Movements/>}>
          </Route>

          <Route path="treasury/balances/*" element={<Balances/>}>
          </Route>

          <Route path="companies/*" element={<CompaniesList/>}>
            </Route>


          </Route>


        
        
      </Routes>
      
    </Router>
  );
}

export default App;
