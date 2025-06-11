import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useLocation , useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form"
import { toast, Toaster } from "react-hot-toast";

import "../CSS/TreasuryMovements.css"
import "react-datepicker/dist/react-datepicker.css";

import { getIncomeType } from "../../api/income_expenses.api";
import { getGCurrency } from "../../api/catalogos.api";

const IncomeForm = () => {

    const location = useLocation();
    const { request } = location.state || {}; // Accede al estado pasado

    const [income, setIncome] = useState({ 
                                requestId : request?.id,
                                date: new Date(), 
                                currency : request?.currency,
                                type_request : request?.type_request,
                                amount : request.amount,

                            });

    const [incomeType_List, setIncomeType_List] = useState([]);
    const [currency_List, setCurrency_List] = useState([]);

    console.log(request)


    // Obtener los datos de la API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const incomeTypeResponse = await getIncomeType();
                const currencyResponse = await getGCurrency();

                setIncomeType_List(incomeTypeResponse.data);
                setCurrency_List(currencyResponse.data);

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

        setIncome(prev => ({ 
                ...prev,
                    date: formattedD
            }));
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setIncome((prev) => ({
        ...prev,
        [name]: value,
        }));
    };
    

    return(

        <div>   
            <Toaster /> {/* ¡Sin esto, no se ve el toast! */} 

            <div className="containerRequest">

                <div className="formRequest">

                    <div className="formulario-rectangulo--movements-flotante">
                        <h2>Nuevo Ingreso : Solicitud {income.requestId}</h2>
                        <button type="button" 
                            //onClick={handleSubmit}
                        >
                        Guardar
                        </button>

                        <button 
                            //onClick={handleBack} 
                            className="btn-cancelar"
                            style={{padding:'6px', margin:'4px'}}    
                        >
                            Regresar
                        </button>
                    </div>
                
                    <form>    
                                    

                    <div className="formulario-rectangulo">               

                        <h1>Datos Generales</h1>
                        
                        <div className="input-select-container">
                        
                            <div className="campo-formulariocustomer">
                                <label>Fecha:</label>
                                <DatePicker
                                    id="solicitud_date"
                                    selected={income.date}
                                    onChange={handleDateChange}
                                    dateFormat="dd-MM-yyyy"
                                />
                            </div>

                            <div className="campo-formulariocustomer">
                                <label>Tipo:</label>
                                <select
                                    name="tipo"
                                    className="select-field"
                                    value={income.type_request}
                                    onChange={handleChange}
                                >
                                    <option value="">Selecciona</option>
                                    {incomeType_List.map((itl) => (
                                    <option key={itl.id} value={itl.id}>
                                        {itl.name} 
                                    </option>
                                    ))}
                                </select>
                            </div>

                            <div className="campo-formulariocustomer">
                                <label>Moneda:</label>
                                <select
                                    name="currency"
                                    className="select-field"
                                    value={income.currency}
                                    //onChange={handleChange}    
                                    disabled
                                >
                                    <option value="">Selecciona</option>
                                    {currency_List.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} 
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
                                    value={income.amount}
                                    //onChange={handleChange}
                                    placeholder="Importe"
                                />
                            </div>

                        </div>

                        <div className="input-select-container">
                            <div className="campo-formulariocustomer">
                                <label>Concepto</label>
                                <input
                                    //id="importe"
                                    type="text"
                                    name="title"
                                    value={income.title}
                                    //onChange={handleChange}
                                    placeholder="Title"
                                />
                            </div>

                        </div>
                    </div>

                    <div className="formulario-rectangulo">               

                        <h2>Registro de Ingreso Por Cliente</h2>
                        
                        <div className="input-select-container">
                            <div className="campo-formulariocustomer">
                                    
                                <table className="table-sin-borde">
                                    <thead>
                                        <tr>
                                        <th>Cliente</th>
                                        <th>Tipo de Pago</th>
                                        <th>Importe Nominal</th>
                                        <th></th>
                                        </tr>
                                    </thead>

          	                        <tbody>

                                        { request.clients.length > 0 ? (
                                            request.clients.map((item, index) => (
                                                
                                                <tr key={index} style={{ marginBottom: '1rem' }}>
                                                    <td>
                                                        <input
                                                            style={{width : "300px"}}
                                                            value={item.customer.nombre}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            style={{width : "100px"}}
                                                            value={item.customer.tipo_pago}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            value={item.amount}
                                                        />
                                                    </td>
                                                    
                                                </tr>

                                            ))
                                           
                                        ):( 
            
                                                <tr>
                                                    <td colSpan="11" style={{ textAlign: 'center' }}>No hay clientes seleccionados</td>
                                                </tr>
                                        )}    
                                        
                                    </tbody>

                                    
                                </table>

                            
                            </div>

                        </div>
                    </div>


                </form>

                    
                </div>
            </div>
        </div>
    )
}

export default IncomeForm;