import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useLocation , useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form"
import { toast, Toaster } from "react-hot-toast";

import "../CSS/TreasuryMovements.css"
import "react-datepicker/dist/react-datepicker.css";

import { getIncomeType, getIncomeConciliation } from "../../api/income_expenses.api";
import { getGCurrency } from "../../api/catalogos.api";
import { getAllCompanies, getBankAccountDetail  } from "../../api/companies.api";

const IncomeForm = () => {
   
    const [selectedTypeName, setSelectedTypeName] = useState();

    const defaultRow = {
        empresaId: "",
        cuentasList: [], // Esto es lo que está faltando
        cuentaId: "",
        conciliacionId: "",
        importe: ""
    };

    const [rows, setRows] = useState([{ ...defaultRow }]);

    const location = useLocation();
    const { request } = location.state || {}; // Accede al estado pasado
 
   

    const [income, setIncome] = useState({ 
                                requestId : '',
                                date: new Date(), 
                                //currency : '',
                                //type_request : isRequestValid ? 8 : '',
                                //amount : '',
                                
                                brokers: [],
                                
                                

                            });


    const [incomeType_List, setIncomeType_List] = useState([]);
    const [currency_List, setCurrency_List] = useState([]);
    const [companies_List, setCompanies_List] = useState([]);
    const [conciliation_List, setConciliation_List] = useState([]);

    const [subitemAccounts, setSubitemAccounts] = useState({});

    

    const params = useParams()
    
    useEffect(() => {
        const isRequestValid =
            request &&
            typeof request === 'object' &&
            Object.keys(request).length > 0;

        if (isRequestValid) {
            const clientsWithSubitems = (request.clients || []).map(client => ({
            ...client,
            subitems: client.subitems && client.subitems.length > 0
                ? client.subitems
                : [
                    {
                        empresa: '',
                        efectivo: '',
                        concepto: '',
                        importe: '',
                        conciliation: '',
                    },
                ],
        }));
            setIncome({
                requestId: request.id || '',
                date: new Date(),
                type_request: 8,
                currency: request.currency || '',
                amount: request.amount || '',
                //clients: request.clients || [],
                clients: clientsWithSubitems,
                brokers: request.brokers || [],
                subitems: [
                            {
                                empresa: '',
                                efectivo: '',
                                concepto: '',
                                importe: ''
                            }
                ]
            });

            setSelectedTypeName(8);
        }
    }, [request]);

    console.log("REQUEST",request)
    console.log("income",income)


    // Obtener los datos de la API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const incomeTypeResponse = await getIncomeType();
                const currencyResponse = await getGCurrency();
                const companiesResponse = await getAllCompanies();
                const conciliationResponse = await getIncomeConciliation();

                setIncomeType_List(incomeTypeResponse.data);
                setCurrency_List(currencyResponse.data);
                setCompanies_List(companiesResponse.data);
                setConciliation_List(conciliationResponse.data);

            } catch (error) {
                console.error("Error al cargar los datos", error);
                //setLoading(false);
            }
        };
    
        fetchData();
    }, []);

    const fetchCuentasByEmpresa = async (empresaId, clientIndex, subitemIndex) => {
        console.log("empresaid",empresaId)
        try {
            const response = await getBankAccountDetail(empresaId);  // llamas a la API
            const cuentas = Array.isArray(response.data) ? response.data : []; 
            // Asumo que data es un array de cuentas, ajústalo si la estructura es diferente
            console.log("Data:", response);

            setSubitemAccounts(prev => ({
            ...prev,
            [`${clientIndex}-${subitemIndex}`]: cuentas
            }));
            console.log("data", subitemAccounts)

        } catch (error) {
            console.error('Error fetching accounts:', error);
            setSubitemAccounts(prev => ({
            ...prev,
            [`${clientIndex}-${subitemIndex}`]: []
            }));
        }
        };


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

        if (name === "tipo") {
            const selectedOption = incomeType_List.find(itl => itl.id.toString() === value);
            setSelectedTypeName(selectedOption.id)
            console.log(name, selectedOption)
        }


        setIncome((prev) => ({
        ...prev,
        [name]: value,
        }));
    };



    useEffect(() => {
        if (income?.clients?.length > 0) {
            const updatedClients = income.clients.map(client => ({
            ...client,
            subitems: client.subitems && client.subitems.length > 0
                ? client.subitems
                : [
                    {
                    empresa: '',
                    efectivo: '',
                    concepto: '',
                    importe: '',
                    conciliation: ''
                    }
                ]
            }));
            
            setIncome(prev => ({
            ...prev,
            clients: updatedClients
            }));
        }
        }, []);


    const handleSubitemChange = async (clientIndex, subitemIndex, field, value) => {
        const updatedClients = [...income.clients];
        const subitem = updatedClients[clientIndex].subitems[subitemIndex];

        subitem[field] = value;

        // Si cambia la empresa, limpia la cuenta y busca las nuevas
        if (field === 'empresa') {
            subitem.efectivo = '';
            setIncome({ ...income, clients: updatedClients });

            await fetchCuentasByEmpresa(value, clientIndex, subitemIndex);
            return;
        }

        setIncome({ ...income, clients: updatedClients });
    };
    //console.log(income.subitems)
    
    const handleSubmit = async (e) => {
        const validate_data = rows.every(
            (row) =>
                row.empresaId &&
                row.cuentaId &&
                row.conciliacionId &&
                row.importe &&
                parseFloat(row.importe) > 0
        );

        //if (!validate_data) {
        //    alert("Completa todos los campos correctamente antes de guardar.");
        //    return;
       // }

        // Aquí ya puedes usar la variable rows para enviar al backend
        console.log("Datos a guardar:", rows);

    
        
           
        if (params.id) {
                console.log(params.id,"updated:", income)
                //await Requestupdate(params.id, data)
                toast.success('Cliente updated success', {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff",
                    },
                })
            } else {
                //data.status = 1;
                console.log("created:", income)
                //await RequestCreate(data);
                toast.success('Cliente created success', {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff",
                    },
                })
            }
    
                //setTimeout(() => {
                //    navigate("/dashboard/treasury/movements/solicitudes");
                //}, 1000); 
    
        }

    const addSubitemToClient = (clientIndex) => {
        console.log("client index", clientIndex)
        const updatedClients = [...income.clients];
        console.log("client index", updatedClients)

        if (!Array.isArray(updatedClients[clientIndex].subitems)) {
            updatedClients[clientIndex].subitems = [];
        }
    
        updatedClients[clientIndex].subitems.push({
            empresa: '',
            efectivo: '',
            concepto: '',
            importe: ''
        });
        setIncome({ ...income, clients: updatedClients });
    };

    // >>> Add Empresas
    const agregarRegistro = () => {
         setRows((prevRows) => [...prevRows, { ...defaultRow }]);
  };

  const handleRemoveRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

    // Manejar cambios en los campos
    const manejarCambio = async (index, empresaId) => {
    console.log(index, campo, empresaId)
    try {
      const accountResponse = await getBankAccountDetail(empresaId);
      const newRows = [...rows];
      newRows[index].empresaId = empresaId;
      newRows[index].cuentasList = accountResponse.data;
      newRows[index].cuentaId = ""; // Reset cuenta seleccionada
      console.log(newRows)
      setRows(newRows);
    } catch (error) {
      console.error("Error al obtener cuentas", error);
    }
  };

  const handleEmpresaChange = async (index, empresaId) => {
    try {
      const accountResponse = await getBankAccountDetail(empresaId);
      const newRows = [...rows];
      newRows[index].empresaId = empresaId;
      newRows[index].cuentasList = accountResponse.data;
      newRows[index].cuentaId = ""; // Reset cuenta seleccionada
      setRows(newRows);
    } catch (error) {
      console.error("Error al obtener cuentas", error);
    }
  };

  const handleFieldChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };
    // <<<

    


    return(

        <div>   
            <Toaster /> {/* ¡Sin esto, no se ve el toast! */} 

            <div className="container">

                <div className="formulario-rectangulo--movements-flotante">
                    <h2>Nuevo Ingreso : Solicitud {income.requestId}</h2>
                    <button type="button" 
                        onClick={handleSubmit}
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
                                    //disabled
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
                                    placeholder="0.00"
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

                    {selectedTypeName === 3 && (

                        <div className="formulario-rectangulo">               

                            <h1> Cuentas Bancarias - Caja - Efectivo </h1>
                            
                            <table className="table-sin-borde">
                                        
                                <thead>
                                    <tr>
                                        <th>Empresa</th>
                                        <th>Cuenta</th>
                                        <th>Importe</th>
                                        <th>Conciliación</th>
                                        <th><button type="button" style={{ marginTop: 10 }} onClick={agregarRegistro}>
                                            Agregar
                                        </button></th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {rows.map((row, index) => (
                                        
                                    <tr key={index}>
                                        <td>
                                            <select
                                                name="empresa"
                                                value={row.empresaId}
                                                onChange={(e) => handleEmpresaChange(index, e.target.value)}
                                            >
                                                <option value="">Seleccionar empresa</option>
                                                {companies_List.map((opt) => (
                                                <option key={opt.id} value={opt.id}>{opt.company_name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                            value={row.cuentaId}
                                            onChange={(e) => handleFieldChange(index, "cuentaId", e.target.value)}
                                            disabled={!Array.isArray(row.cuentasList) || row.cuentasList.length === 0}
                                            >
                                            <option value="">Seleccione</option>
                                            {row.cuentasList.map((cuenta) => (
                                                <option key={cuenta.id} value={cuenta.id}>
                                                {cuenta.name}
                                                </option>
                                            ))}
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={row.importe}
                                                onChange={(e) => handleFieldChange(index, "importe", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <select
                                                value={row.conciliacionId}
                                                onChange={(e) => handleFieldChange(index, "conciliacionId", e.target.value)}
                                            >
                                                <option value="">Seleccione</option>
                                                {conciliation_List.map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                    {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <button 
                                                type="button" 
                                                onClick={() => handleRemoveRow(index)}
                                                style={{background: 'red'}}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {selectedTypeName === 8 && (
                    <div className="formulario-rectangulo">               

                        <h2>Registro de Ingreso Por Cliente</h2>
                        
                        <div className="input-select-container">
                            <div className="campo-formulariocustomer">
                                    
                                <table className="table-sin-borde">
                                    {/*}
                                    <thead>
                                        <tr>
                                        <th>Cliente</th>
                                        <th>Tipo de Pago</th>
                                        <th>Importe Nominal</th>
                                        <th></th>
                                        </tr>
                                    </thead>

                                    */}

          	                        <tbody>

                                        { income.clients.length > 0 ? (
                                            
                                            income.clients.map((item, index) => (
                                                
                                                <React.Fragment key={index}>
                                                    <tr>
                                                        <th>Cliente</th>
                                                        <th>Tipo de Pago</th>
                                                        <th>Importe Nominal</th>
                                                        <th></th>
                                                        <th></th>
                                                    </tr>                                                                                                
                                                    <tr>
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

                                                    {/* Subitems */}
                                                    <tr>
                                                        <td>Empresa</td>
                                                        <td>Cuenta-Caja-Efectivo</td>
                                                        <td>Importe</td>
                                                        <td>Conciliacion</td>
                                                        <td colSpan="4">
                                                        <button
                                                            type="button"
                                                            onClick={() => addSubitemToClient(index)}
                                                        >
                                                            Agregar
                                                        </button>
                                                        </td>
                                                    </tr>
                                                
                                                    {item.subitems?.map((subitem, subIndex) => (
                                                    <tr key={`subitem-${index}-${subIndex}`} style={{ background: '#f9f9f9' }}>
                                                        <td>
                                                        <select
                                                            name="empresa"
                                                            value={subitem.empresa}
                                                            onChange={(e) => handleSubitemChange(index, subIndex, 'empresa', e.target.value)} 
                                                        >
                                                            <option value="">Seleccionar empresa</option>
                                                            {companies_List.map((opt, i) => (
                                                            <option key={i} value={opt.id}>{opt.company_name}</option>
                                                            ))}
                                                        </select>
                                                        </td>
                                                        <td>
                                                            <select
                                                                value={subitem.efectivo}
                                                                onChange={(e) => handleSubitemChange(index, subIndex, 'efectivo', e.target.value)}
                                                            >
                                                                <option value="">Seleccionar cuenta</option>
                                                                {(subitemAccounts[`${index}-${subIndex}`] || []).map((acc, i) => (
                                                                <option key={i} value={acc.id}>
                                                                    {acc.name}
                                                                </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        
                                                        <td>
                                                            <input 
                                                                placeholder="Importe" 
                                                                value={subitem.importe}
                                                                onChange={(e) => handleSubitemChange(index, subIndex, 'importe', e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                        <select
                                                            name="conciliation"
                                                            value={subitem.conciliation}
                                                            onChange={(e) => handleSubitemChange(index, subIndex, 'conciliation', e.target.value)} 
                                                        >
                                                            <option value="">Seleccionar</option>
                                                            {conciliation_List.map((con, i) => (
                                                            <option key={i} value={con.id}>{con.name}</option>
                                                            ))}
                                                        </select>
                                                        </td>

                                                    </tr>
                                                    ))}

                                                    <tr>
                                                    
                                                    </tr>
                                                </React.Fragment>

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
                    )}

                </form>
                    
                </div>
            </div>
        
    )
}

export default IncomeForm;