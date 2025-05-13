import { Link } from 'react-router-dom';

const MenuLateralMovimientos = () => {
  return (
    <div style={{ width: 200, background: '#f0f0f0', padding: 10 }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><Link to="solicitudes">Solicitudes</Link></li>
        <li><Link to="ingresos">Ingresos</Link></li>
        <li><Link to="egresos">Egresos</Link></li>
        <li><Link to="traspasos">Traspasos</Link></li>
      </ul>
    </div>
  );
};

export default MenuLateralMovimientos;
