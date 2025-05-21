import { Link, Routes, Route } from 'react-router-dom';
import MenuLateralMovimientos from './MenuLateralMovimientos';
import { RequestsList } from './ListsRequests';
import { SolicitudFormPage } from './SolicitudFormPage';




const LayoutMovimientos = () => {
  return (
    <div style={{ display: 'flex', flex: 1 }}>
      <MenuLateralMovimientos />
      <div style={{ padding: 20, flex: 1 }}>
        {/*}
        <Routes>
          <Route path="solicitudes/" element={<RequestsList />} >
          <Route path="solicitudes/solicitud" element={<SolicitudFormPage />} ></Route>
          <Route path="solicitudes/solicitud/:id" element={<SolicitudFormPage />} ></Route>
          </Route>
        </Routes>
        */}
      </div>
    </div>
  );
};

export default LayoutMovimientos;
