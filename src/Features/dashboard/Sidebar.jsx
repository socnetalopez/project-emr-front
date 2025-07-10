import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './css/sidebar.css';

function Sidebar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token || token.split('.').length !== 3) {
      console.warn('Token ausente o mal formado');
      logoutAndRedirect();
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUsername(decoded.username || 'Usuario');
    } catch (error) {
      console.error('Token inválido:', error);
      logoutAndRedirect();
    }
  }, [navigate]);

  const logoutAndRedirect = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  const handleLogout = () => logoutAndRedirect();

  if (username === null) return null; // evita render hasta que se valide el token

  return (
    <div style={sidebarStyles.container}>
      <div style={sidebarStyles.userInfo}>
        <p><strong>:::{username}</strong></p>
        <button onClick={handleLogout} style={sidebarStyles.logoutBtn}>Cerrar sesión</button>
      </div>

      <ul style={styles.menu}>
        <li><Link to="/dashboard" style={styles.link}>Inicio</Link></li>
        <li><Link to="/dashboard/employees" style={styles.link}>Empleados</Link></li>
        <li><Link to="/dashboard/customers" style={styles.link}>Clientes</Link></li>
        <li><Link to="/dashboard/providers" style={styles.link}>Proveedores</Link></li>

        <MenuItem
          label="Information Technologies"
          isOpen={openSubMenu === "it"}
          onClick={() => setOpenSubMenu(openSubMenu === "it" ? null : "it")}
          items={[
            { to: "/dashboard/equipments/equipments", label: "Inventory" },
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

const sidebarStyles = {
  container: {
    width: "180px",
    backgroundColor: "#242948",
    color: "white",
    padding: "0px",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    fontSize: "15px",
    boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
  },
  userInfo: {
    padding: "10px 15px",
    borderBottom: "1px solid #333",
  },
  logoutBtn: {
    marginTop: "10px",
    backgroundColor: "#dc3545",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    color: "#fff",
    cursor: "pointer",
  },
};

const styles = {
  menu: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    backgroundColor: "#242948",
    width: "180px",
    color: "white",
    fontFamily: "sans-serif",
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
    backgroundColor: "#242948",
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
