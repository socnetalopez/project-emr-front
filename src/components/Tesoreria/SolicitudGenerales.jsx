
// src/components/SolicitudGeneral.jsx

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";


import  SolicitudClientes  from './SolicitudClientes';

import { getMonedas, getFormaPago, getTipoOperacion, getTipoSolicitud, getTipoPago } from "../../api/solicitudes.api";
import { getAllPromoters } from "../../api/catalogos.api";

import LayoutSUP from "./LayoutSup";

import "react-datepicker/dist/react-datepicker.css";
import '../CSS/FormularioCentrado.css';
import '../CSS/Layout.css';

const SolicitudGeneral = () => {
    const [promotores_All, setPromotores_All] = useState([]);
    const [promotores, setPromotores] = useState([]);
    const [tipoSolicitud, setTipoSolicitud] = useState('');
    const [selectedPromotor, setSelectedPromotor] = useState('');

    const [monedas, setMonedas] = useState([]);
    const [formaPagos, setformaPagos] = useState([]);
    const [tipoOperaciones, settipoOperaciones] = useState([]);
    const [tipoSolicitudes, settipoSolicitudes] = useState([]);
    const [tipoPagos, settipoPagos] = useState([]);

    const [warningVisible, setWarningVisible] = useState(false); // Controla la advertencia de cambio de promotor

    const [clientesData, setClientesData] = useState([{importe: []}]);
    const [comisionesData, setComisionesData] = useState({mporte: []});
    const [datosComision, setDatosComision] = useState([{importe: []}]);
    // Estado para el formulario
    const [formData, setFormData] = useState({
        solicitud_date: new Date(),

    });
    
    // Obtener los datos de la API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const monedasResponse = await getMonedas();
                const formapagoResponse = await getFormaPago();
                const promotorResponse = await getAllPromoters();
                const tipooperacionResponse = await getTipoOperacion();
                const tiposolicitudResponse = await getTipoSolicitud();
                const tipopagoResponse = await getTipoPago();
                
                setMonedas(monedasResponse.data);
                setformaPagos(formapagoResponse.data);
                setPromotores_All(promotorResponse.data)
                settipoOperaciones(tipooperacionResponse.data);
                settipoSolicitudes(tiposolicitudResponse.data);
                settipoPagos(tipopagoResponse.data);
                

            } catch (error) {
                console.error("Error al cargar los datos", error);
                //setLoading(false);
            }
        };
    
        fetchData();
    }, []);
    

    // Manejo de la fecha
    const handleDateChange = (date) => {
        const formattedD = date ? date.toISOString().split("T")[0] : ''; // Formats to YYYY-MM-DD
        setFormData({
            ...formData,
        solicitud_date: formattedD,
        });
    };

    // Manejar el cambio de promotor
    const handlePromoterChange = (e) => {
        if (tipoSolicitud.length > 0) {
            // Si hay registros agregados, mostrar advertencia
            setWarningVisible(true);
            setSelectedPromotor(e.target.value);
        } else {
            setSelectedPromotor(e.target.value);
        }
    };

    // Aceptar el cambio de promotor y limpiar los registros
    const confirmPromoterChange = () => {
        //setRecords([]);
        //setSelectedPromotor('');
        setTipoSolicitud('')
        setWarningVisible(false);
    };

    // Cancelar el cambio de promotor
    const cancelPromoterChange = () => {
        setWarningVisible(false);
    };

    const handleSubmit = (e) => {
        const data = {
            solicitud_date
        }
        console.log("Save: ", formData, clientesData, comisionesData, datosComision)
         alert('Datos guardados');

    }

    return (
       
        <div>

            <div className="headerLayoutSup">
                <h2 style={{width:'500px'}}>Solicitudes : Editar</h2>
                <button onClick={handleSubmit}>
                    Guardar
                </button>
            </div>
           
            <div className="formrequest">
            
                <h1>Datos Generales</h1>

                <div className="input-select-container">
                    <div>
                        <label>Fecha:</label>
                        <DatePicker
                            id="solicitud_date"
                            selected={formData.solicitud_date}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            //lassName="bg-zinc-200 p-3 rounded-lg input-field"
                        />
                    </div>

                <div >
                    <label>Moneda:</label>
                    <select
                        
                        //id="moneda"
                        name="moneda"
                        value={formData.moneda}
                        className="select-field"
                        required
                    >
                        <option value="">Selecciona una moneda</option>
                        {monedas.map((moneda) => (
                        <option key={moneda.id} value={moneda.id}>
                            {moneda.name} 
                        </option>
                        ))}
                    </select>
                </div>
                    <div>
                        <label>Importe</label>
                        <input
                            //id="importe"
                            type="number"
                            name="importe"
                            placeholder="Importe" 
                        />
                    </div>
                    <div className="campo-formulariocustomer">
                        <label>Forma de Pago:</label>
                        <select
                            //id="forma_pago"
                            //name="forma_pago"
                            className="select-field"
                            required
                        >
                            <option value="">Selecciona un tipo</option>
                            {formaPagos.map((fp) => (
                                <option key={fp.id} value={fp.id}>
                                {fp.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
        

                <div className="input-select-container">
                    <div className="campo-formulariocustomer">
                        <label>Promotor:</label>
                        <select
                            className="select-field"
                            //onChange={(e) => setSelectedPromotor(e.target.value)}
                            onChange={handlePromoterChange}
                        >
                            <option value="">Seleccione</option>
                                {promotores_All.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="campo-formulariocustomer">
                        <label >Tipos de Operacion:</label>
                        <select
                            //id="tipo_operacion"
                            //name="tipo_operacion"
                            value={formData.tipo_operacion}
                            className="select-field"
                        >
                            <option value="">Seleccione</option>
                            {tipoOperaciones.map((o) => (
                            <option key={o.id} value={o.id}>
                                {o.name}
                            </option>
                            ))}
                        </select>
                    </div>

                    <div className="campo-formulariocustomer">
                        <label htmlFor="tipo_solicitud">Tipos de Solicitud:</label>
                        <select
                            onChange={(e) => setTipoSolicitud(e.target.value)}
                            className="bg-zinc-200 p-3 rounded-lg select-field"
                        >
                            <option value="">Seleccione</option>
                                {tipoSolicitudes.map((ts) => (
                            <option key={ts.id} value={ts.id}>
                                {ts.name}
                            </option>
                                ))}
                        </select>
                    </div>

                    <div className="campo-formulariocustomer">
                        <label htmlFor="tipo_pago">Tipo de Pago:</label>
                        <select
                            id="tipo_pago"
                            name="tipo_pago"
                            value={formData.tipo_pago}
                            className="bg-zinc-200 p-3 rounded-lg select-field"
                        >
                            <option value="">Seleccione</option>
                            {tipoPagos.map((tp) => (
                            <option key={tp.id} value={tp.id}>
                                {tp.name}
                            </option>
                            ))}
                        </select>
                    </div>
                </div>  

                {/* Advertencia de cambio de promotor */}
                {warningVisible && (
                    <div>
                    <p>¿Estás seguro de cambiar el promotor? Todos los registros de clientes se eliminarán.</p>
                    <button onClick={confirmPromoterChange}>Aceptar</button>
                    <button onClick={cancelPromoterChange}>Cancelar</button>
                    </div>
                )}

                {tipoSolicitud === '1' && selectedPromotor && (            
                    <SolicitudClientes promotorId={selectedPromotor} setClientesData={setClientesData} setDatosComision={setDatosComision} datosComision={datosComision}/>
                )}

                {tipoSolicitud === '2' && selectedPromotor && (
                    <div>
                        <h2>Aplicacion Anticipo de Clientes</h2>
                        <label>Tipo de Ingreso: </label>
                        <SolicitudClientes promotorId={selectedPromotor} setClientesData={setClientesData} setDatosComision={setDatosComision} datosComision={datosComision} />

                    </div>
                            
                
                )}

            </div>
        </div>
    );
};

export default SolicitudGeneral;
