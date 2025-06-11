
// src/components/SolicitudGeneral.jsx

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form"
import { toast, Toaster } from "react-hot-toast";

import  SolicitudClientes  from './SolicitudClientes';

import { getMonedas, getFormaPago, getTipoOperacion, getTipoSolicitud, getTipoPago, RequestCreate, getRequest, Requestupdate } from "../../api/solicitudes.api";
import { getAllPromoters } from "../../api/catalogos.api";
import { getIncomeType } from "../../api/income_expenses.api";

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
    //const [request, setRequest] = useState({ date: new Date()});
    const [request, setRequest] = useState({ 
                                        date: new Date(), 
                                        currency : '', 
                                        type_request : '',
                                        amount : '',
                                    });

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
            console.log("req:",request, "-", clientesData, datosComision)
            
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
                const tiposolicitudResponse = await getIncomeType();
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
            commission_agents : (datosComision.comisionistas || []).filter( item => item !== undefined && item !== null && item !== ''),
            brokers : (datosComision.brokers  || []).filter(item => item !== undefined && item !== null && item !== ''),
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
                console.log(params.id,"updated:", data)
                await Requestupdate(params.id, data)
                toast.success('Cliente updated success', {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff",
                    },
                })
            } else {
                data.status = 1;
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

            setTimeout(() => {
                navigate("/dashboard/treasury/movements/solicitudes");
            }, 1000); // Espera 1.5 segundos
            //navigate("/dashboard/treasury/movements/solicitudes")
        //alert('Datos guardados');

    }

    const handleBack = () => {
        navigate(-1); // Esto regresa una página en el historial
    };

    const requestWithId = { ...request, id: params.id };

    const newIncome = () => {
        navigate("/dashboard/treasury/movements/ingresos/income", {
            state: {request: requestWithId}
        }

        );
    };

    //console.log("al final general", request)
    //console.log("al final",clientesData );

    // >>> Anticipo Cliente

    const agregar_AnticipoCliente = () => {
    //setClientesSeleccionados([
    //    ...clientesSeleccionados,
    //    { cliente: null, importe: 0, comision_venta: null }
    //]);
    console.log("Anticipo Cliente")
    };

    // <<<<

    return (

    <div>   
        <Toaster /> {/* ¡Sin esto, no se ve el toast! */} 

        <div className="containerRequest">

            <div className="formRequest">

                <div className="formulario-rectangulo--movements-flotante">
                    
                    <h2>Solicitudes : {params.id ? 'Editar  ' : 'Nuevo  '}
                    {/*}
                    <span className={`status-label ${
                        request.status === 1 ? 'orange' :
                        request.status === 2 ? 'blue' :
                        request.status === 3 ? 'green' : 
                        request.status === 4 ? 'green' : 'gray'
                        }`}
                    >
                        {request.status === 1 ? 'Pendiente : Convertir a INGRESO' :
                        request.status === 2 ? 'Ingreso : Convertir a EGRESO' :
                        request.status === 3 ? 'Egreso Parcial' :
                        request.status === 4 ? 'Egreso Total' : '-'}
                    </span>
                    */}

                    </h2>

                    <button type="button" onClick={handleSubmit}>
                        {params.id ? 'Actualizar ' : 'Guardar'}
                    </button>

                    <button 
                        onClick={handleBack} 
                        className="btn-cancelar"
                        style={{padding:'6px', margin:'4px'}}    
                    >
                        Regresar
                    </button>

                    <button 
                        onClick={newIncome} 
                        className="btn-cancelar"
                        style={{padding:'6px', margin:'4px', background: 'orange '}}    
                    >
                        Crear Ingreso
                    </button>

                    
                </div>

                <form onSubmit={handleSubmit}>    
                    
                    <div className="formulario-rectangulo">               

                    <h1>Datos Generales</h1>
                    
                    <div className="input-select-container">
                    
                        <div className="campo-formulariocustomer">
                            <label>Fecha:</label>
                            <DatePicker
                                id="solicitud_date"
                                selected={request.date}
                                onChange={handleDateChange}
                                dateFormat="dd-MM-yyyy"
                            />
                        </div>

                        <div className="campo-formulariocustomer">
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

                        <div className="campo-formulariocustomer">
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
                                { formaPagos.map((fp) => (
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
                    <div style={{ border: '1px solid gray', padding: '16px', borderRadius: '8px', backgroundColor: '#f8f8f8', marginBottom: '16px' }}>
                        <p>¿Estás seguro de cambiar el promotor? Todos los registros de clientes se eliminarán.</p>
                        <button onClick={confirmPromoterChange}>Aceptar</button>
                        <button onClick={cancelPromoterChange}>Cancelar</button>
                    </div>
                )}

                
                {tipoSolicitud === '1' && selectedPromotor && (
                            
                    <SolicitudClientes 
                            promotorId={selectedPromotor} 
                            clientesData={clientesData} setClientesData={setClientesData} 
                            datosComision={datosComision} setDatosComision={setDatosComision} 
                    />
                )}
                
                
                {tipoSolicitud === '2' && selectedPromotor && (
                    <div>
                        <div className="formulario-rectangulo">

                            <h2>Aplicacion Anticipo de Clientes</h2>
                            <button onClick={agregar_AnticipoCliente}>Agregar</button>

                            <div className="campo-formulariocustomer">
                                <table >
                                <thead>
                                    <tr>
                                        <th>Tipo Ingreso</th>
                                        <th>Cliente</th>
                                        <th>Anticipo</th>
                                        <th>Aplicaciones</th>
                                        <th>Saldo</th>
                                        <th>Aplicacion</th>
                                        <th>Nuevo Saldo</th>
                                    </tr>
			                    </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <select>
                                                <option></option>
                                            </select>
                                        </td>

                                        <td>
                                            <select>
                                                <option></option>
                                            </select>
                                        </td>

                                        <td>
                                            <input>
                                            </input>
                                        </td>

                                        <td>
                                            <input>
                                            </input>
                                        </td>

                                        <td>
                                            <input>
                                            </input>
                                        </td>

                                        <td>
                                            <input>
                                            </input>
                                        </td>

                                        <td>
                                            <input>
                                            </input>
                                        </td>

                                    </tr>
                                </tbody>
                                </table>

                                
                            </div>
                        </div>
                        <SolicitudClientes 
                            promotorId={selectedPromotor} 
                            clientesData={clientesData} setClientesData={setClientesData} 
                            datosComision={datosComision} setDatosComision={setDatosComision} 
                        />
                    </div>
                            
                )}
                </div>

            </div>
        </div>
        
       
    );
};

export default SolicitudGeneral;
