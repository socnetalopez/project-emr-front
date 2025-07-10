import { Link, Routes, Route, NavLink, Outlet  } from 'react-router-dom';
import React, { useState } from 'react';

import { RequestsList } from './ListsRequests';
import { SolicitudFormPage } from './SolicitudFormPage';

import { IncomeList } from '../Income_Expenses/ListsIncome';

import IncomeForm from '../Income_Expenses/FormIncome';

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
						<Link to="/dashboard/treasury/movements/ingresos">Ingresos</Link>
					</li>

					<li>
						<Link to="/dashboard/treasury/movements/balances">Saldos</Link>
					</li>

				</ul>
			</div>

			<div style={{ flex: 1, padding: '20px' }}>
				<Routes>

				<Route path="solicitudes" element={<RequestsList />} />
				<Route path="solicitudes/solicitud" element={<SolicitudFormPage />} />
				<Route path="solicitudes/solicitud/:id" element={<SolicitudFormPage />} />

				<Route path="ingresos" element={< IncomeList />} />
				<Route path="ingresos/income" element={< IncomeForm />} />

				</Routes>
      		</div>
    	</div>
    );    
}