import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar';
import './css/sidebar.css';

function DashboardLayout() {
  const [section, setSection] = useState('home');
  return (
    <div className="dashboard">
      <Sidebar setSection={setSection}/>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
