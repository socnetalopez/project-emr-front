import { Link, Routes, Route, NavLink, Outlet  } from 'react-router-dom';
import React, { useState } from 'react';
import '../CSS/TreasuryMovements.css'

import { RequestsList } from './ListsRequests';
import { SolicitudFormPage } from './SolicitudFormPage';



export function Movements() {
    
    return (
       <div style={{ display: 'flex' }}>
      <div style={{ width: '100px', height:'100vh', background: '#e0e0e0', padding: '10px' }}>
        <h4>Movimientos</h4>
        <ul>
          <li>
            <Link to="/dashboard/treasury/movements/solicitudes">Solicitudes</Link>
          </li>
          <li>
            <Link to="ingresos">Ingresos</Link>
          </li>
        </ul>
      </div>

      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="solicitudes" element={<RequestsList />} />
          <Route path="ingresos" element="" />
          <Route path="solicitudes/solicitud" element={<SolicitudFormPage />} />
        </Routes>
      </div>
    </div>
    );    
}