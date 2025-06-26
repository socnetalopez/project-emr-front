import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import DashboardLayout from './components/Dashboard';
import DashboardHome from './components/DashboardHome';
import ProtectedRoute from './components/ProtectedRoute';

import { PromotorFormPage } from "./components/Promoters/FormPromotor";
import { PromotersPage } from './pages/PromotersPage';
import { PromotorDetail } from './components/Promoters/DetailPromotor';

import { BrokersPage } from './pages/BrokersPage';
import { BrokerFormPage } from './components/Brokers/FormBrokers';

import { ComisionistaPage } from './pages/ComisionistaPage';
import { ComisionistaFormPage } from "./components/Comisionistas/FormComisionista";

import { CustomersPage } from "./pages/CustomerPage";
import { CustomerFormPage } from "./components/Customers/FormCustomer";

import LayoutMovimientos from './components/Tesoreria/LayoutMovimientos';
import { TreasuryPage } from './pages/TreasuryPage';
import { SolicitudFormPage } from './components/Tesoreria/SolicitudFormPage';

import Sidebar from './components/Sidebar';
import { RequestsList } from './components/Tesoreria/ListsRequests';
import Layout from './components/Tesoreria/Layout';
import { Movements } from './components/Tesoreria/Movements';

import { CompaniesList } from './components/Companies/ListsCompanies';

import { EquipmentList } from './components/Equipments/ListsEquipment';
import { EquipmentsFormPage } from './components/Equipments/FormEquipments';


function App() {
  return (
    <Router>

      
      <Routes>
      
        <Route path="/" element={<Login />} />
        

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
        }>

          <Route path="promotores" element={<PromotersPage/>} />
          <Route path="promotor" element={<PromotorFormPage/>} />
          <Route path="promotor/:id" element={<PromotorFormPage/>} />
          <Route path="promotordetail/:id" element={<PromotorDetail/>} />
          
          <Route index element={<DashboardHome />} />
          <Route path="brokers" element={<BrokersPage />} />
          <Route path="broker" element={<BrokerFormPage/>} />
          <Route path="broker/:id" element={<BrokerFormPage/>} />

          <Route path="comisionistas" element={<ComisionistaPage />} />
          <Route path="comisionista" element={<ComisionistaFormPage/>} />
          <Route path="comisionista/:id" element={<ComisionistaFormPage/>} />

          <Route path="customers" element={<CustomersPage/>} />
          <Route path="customer" element={<CustomerFormPage/>} />
          <Route path="customer/:id" element={<CustomerFormPage/>} />

          <Route path="equipments/equipments" element={< EquipmentList />} />
          <Route path="equipments/equipment" element={< EquipmentsFormPage />} />
          <Route path="equipments/equipment/:id" element={< EquipmentsFormPage />} />

          { /*<Route path="treasury/movements/*" element={<TreasuryPage/>} /> */}
          <Route path="treasury/movements/*" element={<Movements/>}>
          </Route>

          <Route path="companies/*" element={<CompaniesList/>}>
            </Route>


          </Route>


        
        
      </Routes>
      
    </Router>
  );
}

export default App;
