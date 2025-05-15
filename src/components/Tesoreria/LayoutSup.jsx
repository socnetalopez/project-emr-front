import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Layout.css';

const LayoutSUP = () => {
  const [isNuevo, setIsNuevo] = useState(true);
  const navigate = useNavigate();

  // Función que maneja el clic en el botón Nuevo
  const handleNuevoClick = () => {
    setIsNuevo(false);  // Cambia el botón a "Guardar"
    navigate('solicitud');  // Redirige a la página de solicitud
  };

  // Función que maneja el clic en el botón Guardar
  const handleGuardarClick = () => {
    setIsNuevo(true);  // Cambia el botón a "Nuevo"
    navigate('/solicitudes');  // Redirige a la página de solicitudes
  };

  return (
    <div className="menu">
      <button
        className="btn"
        onClick={handleNuevoClick}
        style={{ display: isNuevo ? 'block' : 'none' }}
      >
        Nuevo
      </button>
      <button
        className="btn"
        onClick={handleGuardarClick}
        style={{ display: isNuevo ? 'none' : 'block' }}
      >
        Guardar
      </button>
    </div>
  );
};

export default LayoutSUP;
