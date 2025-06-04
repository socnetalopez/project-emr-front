
// src/components/SolicitudGeneral.jsx

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast";

import  SolicitudClientes  from './SolicitudClientes';

import { getMonedas, getFormaPago, getTipoOperacion, getTipoSolicitud, getTipoPago, RequestCreate, getRequest, Requestupdate } from "../../api/solicitudes.api";
import { getAllPromoters } from "../../api/catalogos.api";

import LayoutSUP from "./LayoutSup";

import "react-datepicker/dist/react-datepicker.css";
import "../CSS/TreasuryMovements.css"
//import '../CSS/FormularioCentrado.css';
//import '../CSS/Layout.css';

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

    const [clientesData, setClientesData] = useState([]);
    const [comisionesData, setComisionesData] = useState([]);
    const [datosComision, setDatosComision] = useState([]);
    const [request, setRequest] = useState([]);

    const [isLoaded, setIsLoaded] = useState(false);
    
    const navigate = useNavigate();
    const params = useParams()

    const {
        register,
        formState: { errors },
        setValue // Poner valores en el formulario
    } = useForm();
    

    useEffect(() => {
        async function loadRequest(){
        //const loadRequest = async () => {
            if (params.id){
                try {
                    const res  = await getRequest(params.id);
                    const data = res.data
                    const data1 = String(data.type_request);
                    setRequest(data);
                    setSelectedPromotor(data.promoter);
                    setTipoSolicitud(data1);
                    setClientesData(data.clients);
                    
                    datosComision.promoter_fullname = data.promoter.fullname;
                    datosComision.promoter_commission = data.promoter_commission;
                    datosComision.promoter_tax = data.promoter_tax;
                    datosComision.promoter_retorno = data.promoter_retorno;
                    datosComision.house_commission = data.house_commission;
                    datosComision.house_tax = data.house_tax;
                    datosComision.house_retorno = data.house_retorno;
                    datosComision.cost_commission = data.house_commission;
                    datosComision.cost_tax = data.house_tax;
                    datosComision.cost_retorno = data.house_retorno;
                    
                    //datosComision.comisionistas = data.commission_agents;
                    //datosComision.brokers = data.brokers;
                    
                    
                    // Investigar funcionaumiento
                    //setDatosComision(data.commission_agents);
                } catch (error) {
                    console.error("Error loading request:", error);
                }    

            } 
            //console.log("Load: ",params.id, selectedPromotor, tipoSolicitud)
            //console.log("req:",request, "-", clientesData, datosComision)
            
        }
        loadRequest()
    }, [params.id]);
    //request.promoter = request.promoter.id
    console.log("Load initial",request)
    console.log("selected promoter",selectedPromotor)
   //console.log("General customer", clientesData)
   
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

         setRequest(prev => ({ 
                ...prev,
                    date: formattedD
            }));
    };

    // Manejar el cambio de promotor
    const handlePromoterChange = (e) => {
        console.log(e.target.value)
        if (tipoSolicitud.length > 0) {
            // Si hay registros agregados, mostrar advertencia
            setWarningVisible(true);
            setSelectedPromotor({id : e.target.value});
            setRequest(prev => ({ 
                ...prev,
                    promoter: e.target.value
            }));
            
        } else {
            setSelectedPromotor({id : e.target.value});
            setRequest(prev => ({ 
                ...prev,
                    promoter: e.target.value
            }));
        }
    };

    // Manejar el cambio de promotor
    const handleRequest_Type_Change = (e) => {
        console.log(e.target.value)
        setTipoSolicitud(e.target.value);
        setRequest(prev => ({ 
            ...prev,
                type_request: e.target.value
        }));
        
    };

    // Aceptar el cambio de promotor y limpiar los registros
    const confirmPromoterChange = () => {
        //setRecords([]);
        //setSelectedPromotor('');
        setTipoSolicitud('0')
        setWarningVisible(false);
    };

    // Cancelar el cambio de promotor
    const cancelPromoterChange = () => {
        setWarningVisible(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRequest((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        const data = {
            date : request.date,
            currency: request.currency,
            amount: request.amount,
            payment_method: request.payment_method,
            //promoter: request.promoter,
            promoter: selectedPromotor.id,
            type_operation: request.type_operation,
            type_payment: request.type_payment,
            type_request: request.type_request,
            clientes: clientesData.clientesSeleccionados,
            commission_agents : datosComision.comisionistas.filter( item => item !== undefined && item !== null && item !== ''),
            brokers : datosComision.brokers.filter(item => item !== undefined && item !== null && item !== ''),
            cost_commission: datosComision.cost_commission,
            cost_tax: datosComision.cost_tax,
            cost_retorno: datosComision.cost_retorno,
            house_commission: datosComision.house_commission,
            house_tax: datosComision.house_tax,
            house_retorno: datosComision.house_retorno,
            promoter_commission: datosComision.promoter_commission,
            promoter_tax: datosComision.promoter_tax,
            promoter_retorno: datosComision.promoter_retorno,
            //datosComision: datosComision
        }
    
       
        if (params.id) {
                await Requestupdate(params.id, data)
                console.log(params.id,"updated:", data)
                toast.success('Cliente updated success', {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff",
                    },
                })
            } else {
                console.log("created:", data)
                await RequestCreate(data);
                toast.success('Cliente created success', {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff",
                    },
                })
            }
            navigate("/dashboard/treasury/movements/solicitudes")
        //alert('Datos guardados');

    }
    //console.log("al final general", request)
    //console.log("al final",clientesData );

    return (
       
        <div>

            
           
            <div className="containerRequest">
                <div className="formRequest">

                     <div className="formulario-rectangulo">
                        <h2>Solicitudes : {params.id ? 'Editar' : 'Nuevo'}</h2>
                        <button type="button" onClick={handleSubmit}>
                            {params.id ? 'Actualizar Cliente' : 'Crear Cliente'}
                        </button>
                    </div>
                    

                
                    <form onSubmit={handleSubmit}>
                        <div className="formulario-rectangulo">
                        <h1>Datos Generales</h1>
                    <div className="input-select-container">
                        <div>
                            <label>Fecha:</label>
                            <DatePicker
                                id="solicitud_date"
                                selected={request.date}
                                onChange={handleDateChange}
                                dateFormat="dd-MM-yyyy"
                            />
                        </div>

                <div >
                    <label>Moneda:</label>
                    <select
                        name="currency"
                        className="select-field"
                        value={request.currency}
                        onChange={handleChange}    
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
                            name="amount"
                            value={request.amount}
                            onChange={handleChange}
                            placeholder="Importe"
                        />
                    </div>
                    <div className="campo-formulariocustomer">
                        <label>Forma de Pago:</label>
                        <select
                            name="payment_method"
                            value={request.payment_method}
                            onChange={handleChange}
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
                            name="promoter"
                            value={request.promoter?.id}
                            onChange={handlePromoterChange}
                            className="select-field"
                        >
                            <option value="">Seleccione</option>
                                {promotores_All.map(p => (
                            <option key={p.id} value={p.id}>{`${p.name} ${p.paternal_surname} ${p.maternal_surname}`}</option>
                            ))}
                        </select>
                    </div>

                    <div className="campo-formulariocustomer">
                        <label >Tipos de Operacion:</label>
                        <select
                            name="type_operation"
                            value={request.type_operation}
                            onChange={handleChange}
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
                            id="type_request"
                            name="type_request"
                            value={request.type_request}
                            onChange={handleRequest_Type_Change}
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
                            id="type_payment"
                            name="type_payment"
                            value={request.type_payment}
                            onChange={handleChange}
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
                    
                </div>
                </form>

                {/* Advertencia de cambio de promotor */}
                {warningVisible && (
                    <div>
                    <p>¿Estás seguro de cambiar el promotor? Todos los registros de clientes se eliminarán.</p>
                    <button onClick={confirmPromoterChange}>Aceptar</button>
                    <button onClick={cancelPromoterChange}>Cancelar</button>
                    </div>
                )}

                {tipoSolicitud === '1' && selectedPromotor && (            
                    <SolicitudClientes promotorId={selectedPromotor} clientesData={clientesData} setClientesData={setClientesData} datosComision={datosComision} setDatosComision={setDatosComision} />
                )}

                {tipoSolicitud === '2' && selectedPromotor && (
                    <div>
                        <h2>Aplicacion Anticipo de Clientes</h2>
                        <label>Tipo de Ingreso: </label>
                        <SolicitudClientes promotorId={selectedPromotor} clientesData={clientesData} setClientesData={setClientesData} datosComision={datosComision} setDatosComision={setDatosComision} />

                    </div>
                            
                )}

            </div>
        </div>
        </div>
    );
};

export default SolicitudGeneral;
