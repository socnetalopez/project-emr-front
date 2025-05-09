import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './CSS/sidebar.css'

function Sidebar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  let username = 'Usuario';
  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.username;
    } catch (error) {
      console.error('Token inválido');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    padding: "8px 12px",
    display: "block",
    borderRadius: "4px",
    transition: "background 0.2s",
  };

  const linkHoverStyle = {
    backgroundColor: "#444",
  };

  const menuItemStyle = {
    marginBottom: "10px",
  };

  const submenuStyle = {
    listStyle: "none",
    paddingLeft: "15px",
    marginTop: "5px",
  };

  return (
    <div style={{
      width: "220px",
      backgroundColor: "#2c3e50",
      color: "white",
      padding: "20px",
      height: "100vh",
      fontFamily: "Arial, sans-serif",
      fontSize: "15px",
      boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
    }} >

    
	<div className="sidebar-header">
	<p><strong>:::{username}</strong></p>
	<button onClick={handleLogout}>Cerrar sesión</button>
	</div>
    <ul>
        <li><Link to="/dashboard">Inicio</Link></li>
        
        <li>
            <Link to="#" style={{ color: "white", textDecoration: "none" }}>
        	    Estructura
            </Link>
                
            <ul style={{ listStyle: "none", paddingLeft: "10px" }}>
                <li>
                    <Link to="/dashboard/#" style={{ color: "white", textDecoration: "none" }}>
                        Comisiones Venta
                    </Link>
				</li>
				<li>
					<Link to="/dashboard/promotores" style={{ color: "white", textDecoration: "none" }}>
						Promotores
					</Link>
				</li>
				<li>
					<Link to="/dashboard/brokers" style={{ color: "white", textDecoration: "none" }}>
						Brokers
					</Link>
				</li>
				<li>
					<Link to="/dashboard/comisionistas" style={{ color: "white", textDecoration: "none" }}>
						Comisionistas
					</Link>
				</li>
            </ul>
        </li>
    </ul>

    </div>
  );
}

export default Sidebar;
