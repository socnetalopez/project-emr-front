import { Outlet } from 'react-router-dom';
import Menu from './Menu'; // Asumiendo que tu menú está en este archivo

function Layout() {
  return (
    <div style={{ display: 'flex' }}>
      {/* Menú en la izquierda */}
      <div style={{ width: '200px' }}>
        <Menu />
      </div>

      {/* Contenido de la página a la derecha */}
      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet /> {/* Aquí se renderiza el componente de la ruta actual */}
      </div>
    </div>
  );
}

export default Layout;
