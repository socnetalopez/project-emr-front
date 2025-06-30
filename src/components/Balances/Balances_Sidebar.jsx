import { Link, Routes, Route, NavLink, Outlet  } from 'react-router-dom';
import React, { useState } from 'react';


import { BalanceBrokersList } from './ListsBalanceBrokers';


import '../CSS/TreasuryMovements.css'

export function Balances() {
    
    return (
		<div className="movements-layout">
			<div className="sidebar-movements">
				<h4>:: Saldos ::</h4>
				<ul>
					<li>
						<Link to="/dashboard/treasury/movements/solicitudes">Clientes</Link>
					</li>
					<li>
						<Link to="/dashboard/treasury/movements/solicitudes">Promotores</Link>
					</li>
					<li>
						<Link to="/dashboard/treasury/balances/brokers">Brokers</Link>
					</li>
					<li>
						<Link to="/dashboard/treasury/movements/ingresos">Comisionistas</Link>
					</li>
				</ul>
			</div>

			<div style={{ flex: 1, padding: '20px' }}>
				<Routes>
						<Route path="brokers" element={<BalanceBrokersList />} />
				</Routes>
      		</div>
    	</div>
    );    
}