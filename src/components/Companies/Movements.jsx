import { Link, Routes, Route, NavLink, Outlet  } from 'react-router-dom';
import React, { useState } from 'react';

import { RequestsList } from './ListsRequests';
import { SolicitudFormPage } from './SolicitudFormPage';

import '../CSS/TreasuryMovements.css'

export function Movements() {
    
    return (
		<div className="movements-layout">
			<div className="sidebar-movements">
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
				<Route path="solicitudes/solicitud/:id" element={<SolicitudFormPage />} />
				</Routes>
      		</div>
    	</div>
    );    
}