import { React, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './CSS/sidebar.css'

function Sidebar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const toggleSubMenu = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };

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
      width: "180px",
      backgroundColor: "#575360",
      color: "white",
      padding: "0px",
      height: "100vh",
      fontFamily: "Arial, sans-serif",
      fontSize: "15px",
      boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
    }} >

    
	<div>
	<p><strong>:::{username}</strong></p>
	<button onClick={handleLogout}>Cerrar sesión</button>
	</div>
    <ul style={styles.menu}>
        <li><Link to="/dashboard" style={styles.link}>Inicio</Link></li>

        <li>
          <Link to="/dashboard/customers" style={styles.link}>
            Clientes
          </Link>
        </li>
        
			 <MenuItem
				label="Estructura"
				isOpen={openSubMenu === "estructura"}
				onClick={() => toggleSubMenu("estructura")}
				items={[
				{ to: "/dashboard/#", label: "Comisiones Venta" },
				{ to: "/dashboard/promotores", label: "Promotores" },
				{ to: "/dashboard/brokers", label: "Brokers" },
				{ to: "/dashboard/comisionistas", label: "Comisionistas" },
				]}
			/>

          
			<MenuItem
				label="Tesorería"
				isOpen={openSubMenu === "tesoreria"}
				onClick={() => toggleSubMenu("tesoreria")}
				items={[
				{ to: "/dashboard/#", label: "Catálogos" },
				{ to: "/dashboard/treasury/movements", label: "Movimientos" },
				]}
			/>


			<MenuItem
				label="Empresas"
				isOpen={openSubMenu === "empresas"}
				onClick={() => toggleSubMenu("empresas")}
				items={[
				{ to: "/dashboard/companies", label: "Empresas" },
				{ to: "/dashboard/#", label: "Catálogos" },
				]}
			/>


    </ul>

    </div>
  );
}

const MenuItem = ({ label, items, isOpen, onClick }) => (
  <li>
    <div onClick={onClick} style={{ ...styles.link, ...styles.toggle }}>
      {label} <span style={{ float: "right" }}>{isOpen ? "▲" : "▼"}</span>
    </div>
    <div
      style={{
        ...styles.subMenuWrapper,
        maxHeight: isOpen ? `${items.length * 40}px` : "0",
      }}
    >
      <ul style={styles.subMenu}>
        {items.map((item, i) => (
          <li key={i}>
            <Link to={item.to} style={styles.link}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  </li>
);



// 🎨 Estilos
const styles = {
  menu: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    backgroundColor: "#333",
    width: "180px",
    color: "white",
    fontFamily: "sans-serif",
	paddingLeft: -100
  },
  link: {
    display: "block",
    color: "white",
    textDecoration: "none",
    padding: "10px 15px",
    transition: "background 0.3s",
    cursor: "pointer",
  },
  toggle: {
    backgroundColor: "#333",
  },
  subMenuWrapper: {
    overflow: "hidden",
    transition: "max-height 0.4s ease",
    backgroundColor: "#2b2b2b",
  },
  subMenu: {
    listStyle: "none",
    paddingLeft: "15px",
    margin: 0,
  },
};

export default Sidebar;
