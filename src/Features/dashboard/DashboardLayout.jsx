import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './css/DashboardLayout.css';

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
