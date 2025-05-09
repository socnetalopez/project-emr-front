import React, { useState } from 'react';
import './CSS/DashboardLayout.css'

function DashboardLayout() {
  const [section, setSection] = useState('home'); // Estado para manejar la sección activa

  useEffect(() => {
    if (!token) {
      navigate('/login'); // Redirige si no hay token
    }
  }, []);

  return (
    <div className="dashboard-layout">
      
      

    </div>
  );
}

export default DashboardLayout;
