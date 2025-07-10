// FormularioComision.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";

import '../../components/CSS/Comisiones.css';

//import { getComisionVta,  getAllBrokers, getAllComisionistas } from '../../api/catalogos.api';

import { getAllBrokers } from '../../services/brokers.api';
import { getAllComisionistas } from '../../services/commission_agents.api'
import { getComisionVta, getCommIVA, getAllTipo, getAllBase, getAllTaxes, } from '../../services/commissions.api';


//port { getCommIVA } from '../../api/commissions.api';

//import { ColumnSizing } from '@tanstack/react-table';

const FormularioComision = ({ promotorId, comisionventaId, onGuardar, onCancelar }) => {

  const [descripcion, setDescripcion] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [tipo, setTipo] = useState([]);
  const [base, setBase] = useState([]);
  const [venta, setVenta] = useState([]);
  const [costo, setCosto] = useState(0);
  const [casa, setCasa] = useState(0);
  const [comision, setComision] = useState();
  const [iva, setIVA] = useState(1);
  const [ivaCosto, setIVACosto] = useState(0);
  const [ivaCasa, setIVACasa] = useState(0);
  const [ivaComision, setIVAComision] = useState();
  const [ivaPromotor, setIVAPromotor] = useState();
  const [pPromotor, setpPromotor] = useState([]);
  const [comisionPromotor, setComisionPromotor] = useState([]);
  const [tax, setTax] = useState(1);
  const [commIVA, setCommIVA] = useState([]);
  const [tax_All, setTax_All] = useState([]);
  

  const [tipos, setTipos] = useState([]);
  const [bases, setBases] = useState([]);
  const [status, setStatus] = useState([]);

  const [brokersDisponibles, setBrokersDisponibles] = useState([]);
  const [comisionistasDisponibles, setComisionistasDisponibles] = useState([]);

  const [comisionGlobal, setComisionGlobal] = useState(0);
  const [brokers, setBrokers] = useState([]);
  const [comisionistas, setComisionistas] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);

  const [promotorPorcentaje, setPromotorPorcentaje] = useState(0);
  const [porcentajeGlobal, setPorcentajeGlobal] = useState(0);
  const [brokersApi, setBrokersApi] = useState([]);
  const [comisionistasApi, setComisionistasApi] = useState([]);
  const [brokersSeleccionados, setBrokersSeleccionados] = useState([]);
  const [comisionistasSeleccionados, setComisionistasSeleccionados] = useState([]);

  
  const {
          register, 
          formState: { errors },
          setValue // Poner valores en el formulario
      } = useForm();

  const params = useParams()

  // Obtener los datos de la API
  useEffect(() => {
    const fetchCombo = async () => {
        try {
            const tipoResponse = await getAllTipo();
            const baseResponse = await getAllBase();
			const taxResponse = await getAllTaxes();
			const ivaResponse = await getCommIVA();
            const brokerResponse = await getAllBrokers();
            const comisionistaResponse = await getAllComisionistas(); 

            setTipos(tipoResponse.data);
            setBases(baseResponse.data);
			setTax_All(taxResponse.data);
			setCommIVA(ivaResponse.data);
            setBrokersApi(brokerResponse.data)
            setComisionistasApi(comisionistaResponse.data)

        } catch (error) {
            console.error("Error al cargar los datos", error);
            //setLoading(false);
        }
    };
  
      fetchCombo();
  }, []);

  // Cargar Valores para editar
  useEffect(() => {
    async function load(){
        if (comisionventaId){
          try {
            const Response = await getComisionVta(comisionventaId);
            const data = Response.data
			console.log("load cv",data)
            setCode(data.code)
            setName(data.name)
            setTipo(data.tipo.id)
            setBase(data.base.id)
			setTax(data.tax)
			setIVA(data.comiva)
			setIVACosto(data.percentage_iva_cost)
			setIVACasa(data.percentage_iva_house)
			setIVAComision(data.percentage_iva_commission)
			setIVAPromotor(data.percentage_iva_promoter)
            setVenta(data.percentage_sales)
            setCosto(data.percentage_cost)
            setCasa(data.percentage_house)
            setComision(data.percentage_commission)
            setpPromotor(data.percentage_promotor)
			setStatus(data.status)

            const brokersExtraidos = data.comision_brokers.map(item => ({
              ...item.broker,
              porcentaje: parseFloat(item.percentage), // Se visualiza el porcentaje
			  percentage_iva: parseFloat(item.percentage_iva)
            }));

            const comisionistasExtraidos = data.comisionistas.map(item => ({
              ...item.comisionista,
              porcentaje: parseFloat(item.percentage), 
			  percentage_iva: parseFloat(item.percentage_iva)
            }));
    
            setBrokersApi(brokersExtraidos);
            setBrokersSeleccionados(brokersExtraidos); // Si deseas pre-cargarlos

            setComisionistasApi(comisionistasExtraidos);
            setComisionistasSeleccionados(comisionistasExtraidos); // Si deseas pre-cargarlos
            
            console.log(data)

        } catch (error) {
            console.error("Error al cargar los datos", error);
            //setLoading(false);
        }
            
            
        }   
    }
    load()
  }, [])


  // --- > obtener porcentajes ***

  const formatoInicial = "";
  const [pventa, setPventa] = useState(formatoInicial);
  const [pcosto, setPcosto] = useState(formatoInicial);
  const [pcasa, setPcasa] = useState(formatoInicial);
  //const [pcomision, setPcomision] = useState();
  const [ppromotor, setPpromotor] = useState(formatoInicial);
  const [error, setError] = useState("");


  //const toFixed5 = (num) => parseFloat(num).toFixed(5);
  const parseNum = (val) => parseFloat(val) || 0;
  const toFixed5 = (val) => parseFloat(val).toFixed(5);

  const resetValores = () => {
    setCosto(formatoInicial);
    setCasa(formatoInicial);
    setComision("0.00000");
    setpPromotor("0.00000");
    setError("");
  };

  const handleVentaChange = (e) => {
    setVenta(e.target.value || formatoInicial);
    resetValores();
  };

  const handleStartEdit = () => {
    setValue("");
  };

  const calcularYActualizarComision = (nuevoCosto, nuevaCasa) => {
    const suma = parseNum(nuevoCosto) + parseNum(nuevaCasa);
    const vventa = parseNum(venta);
    if (suma > vventa) {
      setError("La suma de Pcosto y Pcasa no puede superar Pventa.");
      return false;
    } else {
      setError("");
      const vcomision = vventa - suma;
      setComision(toFixed5(vcomision));
      setpPromotor(toFixed5(vcomision));
      //setPorcentajeGlobal(toFixed5(vcomision));
      return true;
    }
  };

  const handlePcostoChange = (e) => {
    const value = e.target.value;
    const nuevaSuma = parseNum(value) + parseNum(casa);
    if (nuevaSuma <= parseNum(venta)) {
      setCosto(value);
      calcularYActualizarComision(value, casa);
    }
  };

  const handlePcasaChange = (e) => {
    const value = e.target.value;
    const nuevaSuma = parseNum(costo) + parseNum(value);
    if (nuevaSuma <= parseNum(venta)) {
      setCasa(value);
      calcularYActualizarComision(costo, value);
    }
  };

  const calcularComision = (nuevoCosto, nuevaCasa) => {
    const suma = parseNum(nuevoCosto) + parseNum(nuevaCasa);
    const vventa = parseNum(venta);
    console.log(suma)

    if (suma > vventa) {
      setError("La suma de Pcosto y Pcasa no puede superar Pventa.");
      return;
    }

    setError("");

    setComision(toFixed5(vventa - suma));
  };

  const handleChange = (field, value) => {
    if (field === "costo") {
      setCosto(value);
      calcularComision(value, casa);
    } else if (field === "casa") {
      setCasa(value);
      calcularComision(costo, value);
    }
  };
// < --- **** 


  // **** Recalcula el % del promotor cada vez que se modifica

  useEffect(() => {
  const totalUsado = [...brokersSeleccionados, ...comisionistasSeleccionados]
    .reduce((acc, item) => acc + Number(item.porcentaje), 0);
    setpPromotor(toFixed5(Math.max(comision - totalUsado, 0)));
  }, [brokersSeleccionados, comisionistasSeleccionados,comision]);


  const agregarItem = (tipo, item) => {
    const listaActual = tipo === 'broker' ? brokersSeleccionados : comisionistasSeleccionados;
    const setLista = tipo === 'broker' ? setBrokersSeleccionados : setComisionistasSeleccionados;

    if (listaActual.find(el => el.id === item.id)) return; // Evita duplicados
    setLista([...listaActual, { ...item, porcentaje: 0 }]);
  };


  const eliminarItem = (tipo, id) => {
    const setLista = tipo === 'broker' ? setBrokersSeleccionados : setComisionistasSeleccionados;
    setLista(prev => prev.filter(item => item.id !== id));
  };

  const cambiarPorcentaje = (tipo, id, valor) => {
    
    const actualizados = (tipo === 'broker' ? brokersSeleccionados : comisionistasSeleccionados)
      .map(item =>
        item.id === id ? { ...item, porcentaje: Number(valor) } : item
      );

    const totalOtros = [...(tipo === 'broker' ? comisionistasSeleccionados : brokersSeleccionados)]
      .reduce((acc, cur) => acc + Number(cur.porcentaje), 0);

    const totalActual = actualizados.reduce((acc, cur) => acc + Number(cur.porcentaje), 0);

    if ((totalActual + totalOtros) > comision) return;
    //if ((totalActual + totalOtros) > comision) return;


    if (tipo === 'broker') {
      setBrokersSeleccionados(actualizados);
    } else {
      setComisionistasSeleccionados(actualizados);
    }

  };


useEffect(() => {
  const ivaUsado = [...brokersSeleccionados, ...comisionistasSeleccionados]
    .reduce((acc, item) => acc + Number(item.percentage_iva || 0), 0);

  const porcentajeBase = parseFloat(ivaComision) || 0;

  // El promotor recibe lo que resta del IVA sobre esa base
  const restanteIVA = toFixed5(Math.max(porcentajeBase - ivaUsado, 0));

  setIVAPromotor(restanteIVA);
}, [brokersSeleccionados, comisionistasSeleccionados, ivaComision]);



const cambiarPorcentajeIVA = (tipo, id, valor) => {
	console.log("Percentage IVA", tipo, " - ",id,valor)
  const actualizados = (tipo === 'broker' ? brokersSeleccionados : comisionistasSeleccionados)
    .map(item =>
      item.id === id ? { ...item, percentage_iva: Number(valor) } : item
    );

  const totalOtros = [...(tipo === 'broker' ? comisionistasSeleccionados : brokersSeleccionados)]
    .reduce((acc, cur) => acc + Number(cur.percentage_iva || 0), 0);

  const totalActual = actualizados.reduce((acc, cur) => acc + Number(cur.percentage_iva || 0), 0);

  if ((totalActual + totalOtros) > ivaComision) return;

  if (tipo === 'broker') {
    setBrokersSeleccionados(actualizados);
  } else {
    setComisionistasSeleccionados(actualizados);
  }
};



// **** Final 2

  const handleSubmit = (e) => {

	console.log("Guardar Form")
	e.preventDefault();
    //if (!descripcion || !monto) return;
    const brokers = brokersSeleccionados;
    const comisionistas = comisionistasSeleccionados;
    const promotor = promotorId;
	const comiva = iva;
	const iva_cost = ivaCosto;
	const iva_house = ivaCasa;
	const iva_commission = ivaComision;
	const percentage_iva_promoter = ivaPromotor;
    const percentage_cost = costo;
    const percentage_sales = venta;
    const percentage_house = casa;
    const percentage_commission = comision;
    const percentage_promotor = pPromotor;
    const id = comisionventaId;

    if (name.trim()) {
      onGuardar({
        promotor,
        //code,
        name,
        tipo,
        base,
		tax,
		comiva,
		iva_cost,
		iva_house,
		iva_commission,
		percentage_iva_promoter,
        percentage_cost,
        percentage_sales,
        percentage_house,
        percentage_commission,
        percentage_promotor,
        brokers,
        comisionistas,
        ...(id && { id }), // solo se agrega si existe valor
      });
    }

    // Limpieza opcional
    setDescripcion('');
  };
  
  console.log(status)
  return (

    <div className="modal-overlay">
    	<div className="modal">
		
			<form onSubmit={handleSubmit}>
			
				<div className="encabezado-con-botones">

					<h1 style={{fontSize:'18px', fontWeight:'bold'}}>Comision de Venta</h1>			
					
					<div className="botones">
						{status === 1 &&
							<button> Desactivar </button>
						}
						<button 
							type='submit'  
							className="btn-guardar"
							style={{marginLeft:'580px'}}	
						> Guardar
						</button>

						<button 
							type="button" 
							onClick={onCancelar} 
							className="btn-cancelar"
						> X
						</button>
					</div>
				</div>
			
				<div className='form-rectangulo'>		
					<div className="input-select-container">

						<div className="form-group">
							<label>Codigo:</label>
							<input
								type="text"
								value={code}
								style={{ width: '150px' }}
								onChange={(e) => setCode(e.target.value)}
								disabled
								//required
							/>
						</div>

						<div className="form-group">
							<label>Nombre:</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								style={{ width: '360px'}}
								required
							/>
						</div>
			
						<div className="form-group">
							<label >Tipo:</label>
							<select
								value={tipo}
								onChange={(e) => setTipo(e.target.value)}
							>
							<option value="">Selecciona el Tipo</option>
								{tipos.map((tipo) => (
							<option key={tipo.id} value={tipo.id}>
								{tipo.name}
							</option>
								))}
							</select>
						</div>
				
						<div className="form-group">
							<label>Base:</label>
							<select
								value={base}
								onChange={(e) => setBase(e.target.value)}     
							>
							<option value="">Selecciona el Tipo</option>
								{bases.map((base) => (
							<option key={base.id} value={base.id}>
								{base.name}
							</option>
								))}
							</select>
						</div>
					</div>

					<div className="input-select-container">
						<div className="form-group">
							<label>%Venta:</label>
							<input
								type="number"
								value={venta}
								onChange={handleVentaChange}
								//onChange={(e) => setVenta(e.target.value)}
								required
							/>
						</div>
		
						<div className="form-group">
							<label>%Costo:</label>
							<input
								type="number"
								value={costo}
								//onFocus={() => handleStartEdit(setPcosto)}
								onChange={handlePcostoChange}
								className="input-field"
							/>
						</div>
		
						<div className="form-group">
							<label>%Casa:</label>
							<input
								type="number"
								value={casa}
								onChange={handlePcasaChange}
								required
							/>
						</div>

						<div className="form-group">
							<label>%Comision:</label>
							<input
								type="text"
								value={comision}
								onChange={e => setPorcentajeGlobal(Number(e.target.value))}
								required
							/>
						</div>

						<div className="form-group">
						<label>%Promotor:</label>
						<input
							type="text"
							value={pPromotor}
							onChange={(e) => setpPromotor(e.target.value)}
							required
						/>
						</div>
					</div>

					<div className="input-select-container">
						<div className="form-group">
							<label>IVA:</label>
							<select
								value={iva}
								onChange={(e) => setIVA(Number(e.target.value))}	
							>
								<option value="">Selecciona el Tipo</option>
									{commIVA.map((t) => (
								<option key={t.id} value={t.id}>
									{t.name}
								</option>
									))}
							
							</select>
							
						</div>
						{ iva === 2 && (
							<>
								<div className="form-group">
									<label>% Costo</label>
									<input 
										type="text"
										value={ivaCosto}
										onChange={(e) => setIVACosto(e.target.value)}
										placeholder="0.00" />
								</div>

								<div className="form-group">
									<label>% Casa</label>
									<input type="text" 
										value={ivaCasa}
										onChange={(e) => setIVACasa(e.target.value)}
										placeholder="0.00" />
								</div>

								<div className="form-group">
									<label>% Comision</label>
									<input 
										type="text" 
										value={ivaComision}
										onChange={(e) => setIVAComision(e.target.value)}
										placeholder="0.00" />
								</div>

								<div className="form-group">
									<label>% Promotor</label>
									<input 
										type="text" 
										value={ivaPromotor}
										onChange={(e) => setIVAPromotor(e.target.value)}
										placeholder="0.00" />
								</div>
							</>
								)}
					</div>
				</div>

				<div className='form-rectangulo'>
					<div style={{ padding: '0px', marginLeft:'50px' }}>
						<div style={{ display: 'flex', width : '100%' }}>
							<div style={{ flex: '0 0 500px' }}>
								<div style={{ flex: 1, paddingRight: '10px'}}>

									<label>Brokers</label>
									<select onChange={e => {
										const selected = brokersApi.find(b => b.id === Number(e.target.value));
										if (selected) agregarItem('broker', selected);
									}}>
										<option value="">Seleccionar</option>
											{brokersApi.map(b => (
										<option key={b.id} value={b.id}> { `${b.name} ${b.paternal_surname} ${b.maternal_surname}` } </option>
									))}
									</select>

									<ul>
									{brokersSeleccionados.map(b => (
										<li key={b.id} 
											style={{fontSize: '11px'}}
										>
										<span
											style={{
												width: '200px',        // ancho fijo del texto
												display: 'inline-block',
												whiteSpace: 'nowrap',  // evita que se corte en varias líneas
												overflow: 'hidden',
												textOverflow: 'ellipsis', // puntos suspensivos si se pasa del ancho
												color: '#06386b'
											}}
										>
											{b.name} {b.paternal_surname} {b.maternal_surname}
										</span>
										<input
											type="number"
											value={b.porcentaje}
											onChange={e => cambiarPorcentaje('broker', b.id, e.target.value)}
											style={{ width: '80px' }}
										/>%

										{iva === 2 && (
											<input
												type="number"
												value={b.percentage_iva || ''}
												onChange={e => cambiarPorcentajeIVA('broker', b.id, e.target.value)}
												placeholder="IVA %"
												style={{ width: '80px', marginLeft: '10px' }}
											/>
										)}
																				<button 
											onClick={() => eliminarItem('broker', b.id)} 
											className="boton-eliminar"
										>
											🗑️
										</button>
										</li>
									))}
									</ul>
								</div>
							</div>
				
							{/* Comisionistas */}
							<div style={{ flex: '0 0 500px' }}>
								<div style={{ flex: 1, paddingLeft: '10px' }}>
							
									<label>Comisionista:</label>
									<select onChange={e => {
										const selected = comisionistasApi.find(c => c.id === Number(e.target.value));
										if (selected) agregarItem('comisionista', selected);
									}}>
										<option value="">Seleccionar</option>
											{comisionistasApi.map(c => (
										<option key={c.id} value={c.id}>{ `${c.name} ${c.paternal_surname} ${c.maternal_surname}` }</option>
											))}
									</select>

									<ul>
										{comisionistasSeleccionados.map(c => (
										<li key={c.id} 
											style={{fontSize: '11px'}}>
											<span
												style={{
													width: '200px',        // ancho fijo del texto
													display: 'inline-block',
													whiteSpace: 'nowrap',  // evita que se corte en varias líneas
													overflow: 'hidden',
													textOverflow: 'ellipsis', // puntos suspensivos si se pasa del ancho
												}}
											>
											{c.name} {c.paternal_surname} {c.maternal_surname} </span>
											<input
												type="number"
												value={c.porcentaje}
												onChange={e => cambiarPorcentaje('comisionista', c.id, e.target.value)}
												style={{ width: '90px',  }}
											/>%

											{iva === 2 && (
												<input
													type="number"
													value={c.percentage_iva || ''}
													onChange={e => cambiarPorcentajeIVA('comisionista', c.id, e.target.value)}
													placeholder="IVA %"
													style={{ width: '90px', marginLeft: '10px' }}
												/>
												)}
											<button 
												onClick={() => eliminarItem('comisionista', c.id)} 
												className="boton-eliminar"
											>
												🗑️
											</button>
										</li>
										))}
									</ul>
							
								</div>
							</div>
						</div>
					</div>
            	</div>

      		</form>

    	</div>
	</div>

  	);
  
};

export default FormularioComision