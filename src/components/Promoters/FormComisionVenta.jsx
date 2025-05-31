// FormularioComision.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";

import '../CSS/Comisiones.css';

import { getComisionVta, getAllTipo, getAllBase, getAllBrokers, getAllComisionistas } from '../../api/catalogos.api';
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
  const [pPromotor, setpPromotor] = useState([]);
  const [comisionPromotor, setComisionPromotor] = useState([]);
  const [tax, setTax] = useState([]);

  const [tipos, setTipos] = useState([]);
  const [bases, setBases] = useState([]);
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
            const baseResponse = await getAllBase()
            const brokerResponse = await getAllBrokers();
            const comisionistaResponse = await getAllComisionistas(); 

            setTipos(tipoResponse.data);
            setBases(baseResponse.data);
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
            setCode(data.code)
            setName(data.name)
            setTipo(data.tipo.id)
            setBase(data.base.id)
            setVenta(data.percentage_sales)
            setCosto(data.percentage_cost)
            setCasa(data.percentage_house)
            setComision(data.percentage_commission)
            setpPromotor(data.percentage_promotor)

            const brokersExtraidos = data.comision_brokers.map(item => ({
              ...item.broker,
              porcentaje: parseFloat(item.percentage) // Guardamos también el porcentaje original
            }));

            const comisionistasExtraidos = data.comisionistas.map(item => ({
              ...item.comisionista,
              porcentaje: parseFloat(item.percentage) // Guardamos también el porcentaje original
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
    //setPromotorPorcentaje(Math.max(comision - totalUsado, 0));
    //setPromotorPorcentaje(Math.max(porcentajeGlobal - totalUsado, 0));
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


// **** Final 2

  const handleSubmit = (e) => {
    e.preventDefault();
    //if (!descripcion || !monto) return;
    const brokers = brokersSeleccionados;
    const comisionistas = comisionistasSeleccionados;
    const promotor = promotorId;
    const percentage_cost = costo;
    const percentage_sales = venta;
    const percentage_house = casa;
    const percentage_commission = comision;
    const percentage_promotor = pPromotor;
    const id = comisionventaId;

    if (code.trim()) {
      onGuardar({
        promotor,
        code,
        name,
        tipo,
        base,
        percentage_cost,
        percentage_sales,
        percentage_house,
        percentage_commission,
        percentage_promotor,
        tax,
        brokers,
        comisionistas,
        ...(id && { id }), // solo se agrega si existe valor
      });
    }

    // Limpieza opcional
    setDescripcion('');
  };
  

  return (
    //<div className="formulario-overlay">
    <div className="modal-overlay">
    	<div className="modal">
		<form className="formulario" onSubmit={handleSubmit}>
			<h3> Comisión Venta </h3>
			<div className="input-select-container">
				<label>Codigo:</label>
				<input
					type="text"
					value={code}
					style={{ width: '90px' }}
					className="bg-zinc-200 p-3 rounded-lg block input-field"
					onChange={(e) => setCode(e.target.value)}
					required
				/>

				<label>Nombre:</label>
				<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				style={{ width: '300px' }}
				className="bg-zinc-200 p-3 rounded-lg block input-field"
				required
				/>
        
				<label className=" p-3 rounded-lg block">Tipo:</label>
				<select
					className="bg-zinc-200 rounded-lg select-field"
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
        
				<label className=" p-2 block">Base:</label>
				<select
					className="bg-zinc-200 rounded-lg select-field"
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

        <div className="input-select-container">
        <label>%Venta:</label>
        <input
          type="number"
          value={venta}
          onChange={handleVentaChange}
          //onChange={(e) => setVenta(e.target.value)}
          className="bg-zinc-200 p-3 rounded-lg block input-field"
          required
        />

        <label>%Costo:</label>
        <input
          type="number"
          value={costo}
          //onFocus={() => handleStartEdit(setPcosto)}
          onChange={handlePcostoChange}
          className="bg-zinc-200 p-3 rounded-lg block input-field"
        />
        
        <label>%Casa:</label>
        <input
          type="number"
          value={casa}
          onChange={handlePcasaChange}
          className="bg-zinc-200 p-3 rounded-lg block input-field"
          required
        />

        <label>%Comision:</label>
        <input
          type="text"
          value={comision}
          onChange={e => setPorcentajeGlobal(Number(e.target.value))}
          className="bg-zinc-200 p-3 rounded-lg block input-field"
          required
        />


        <label>%Promotor:</label>
        <input
          type="text"
          value={pPromotor}
          onChange={(e) => setpPromotor(e.target.value)}
          className="bg-zinc-200  rounded-lg block input-field"
          required
        />
        </div>

        <div className="input-select-container">
          <label className="  block">IVA:</label>
          <select
            className=" select-field "
            value={tax}
            onChange={(e) => setTax(e.target.value)}
            
          >
            <option value="">Selecciona el Tipo</option> 
            <option value="No Aplica">No Aplica</option>
            <option value="Aplica">Aplica</option>
            
          </select>

          <label>% Comisión Global:</label>
          <input
            type="number"
            value={comision}
            onChange={e => setComision(Number(e.target.value))}
            //onChange={e => setPorcentajeGlobal(Number(e.target.value))}
            style={{ width: '100px' }}
          />
        </div>

        <div style={{ padding: '20px' }}>

          <div style={{ marginBottom: '10px' }}>
            <hr />

			<div style={{ display: 'flex', gap: '40px' }}>
				<div style={{ flex: 1 }}>

				
            <label>Seleccionar Broker:</label>
            <select onChange={e => {
              const selected = brokersApi.find(b => b.id === Number(e.target.value));
              if (selected) agregarItem('broker', selected);
            }}>
              <option value="">--Seleccionar--</option>
              {brokersApi.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            <ul>
              {brokersSeleccionados.map(b => (
                <li key={b.id} 
                  style={{fontSize: '12px'}}
                >
                  <span
                      style={{
                        width: '250px',        // ancho fijo del texto
                        display: 'inline-block',
                        whiteSpace: 'nowrap',  // evita que se corte en varias líneas
                        overflow: 'hidden',
                        textOverflow: 'ellipsis', // puntos suspensivos si se pasa del ancho
                      }}
                    >
                  {b.name} {b.paternal_surname} {b.maternal_surname}

                  </span>
                  <input
                    type="number"
                    value={b.porcentaje}
                    onChange={e => cambiarPorcentaje('broker', b.id, e.target.value)}
                    style={{ width: '60px', marginLeft: '10px' }}
                  />%
                  <button onClick={() => eliminarItem('broker', b.id) } className="boton-eliminar">❌</button>
                </li>
              ))}
            </ul>
			</div>
            
            {/* Comisionistas */}
			<div style={{ flex: 1 }}>
            <div>
              <label>Seleccionar Comisionista:</label>
              <select onChange={e => {
                const selected = comisionistasApi.find(c => c.id === Number(e.target.value));
                if (selected) agregarItem('comisionista', selected);
              }}>
                <option value="">--Seleccionar--</option>
                {comisionistasApi.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <ul>
                {comisionistasSeleccionados.map(c => (
                  <li key={c.id} 
                    style={{fontSize: '12px'}}>
                    <span
                      style={{
                        width: '250px',        // ancho fijo del texto
                        display: 'inline-block',
                        whiteSpace: 'nowrap',  // evita que se corte en varias líneas
                        overflow: 'hidden',
                        textOverflow: 'ellipsis', // puntos suspensivos si se pasa del ancho
                      }}
                    >
                    {c.name} </span>
                    <input
                      type="number"
                      value={c.porcentaje}
                      onChange={e => cambiarPorcentaje('comisionista', c.id, e.target.value)}
                      style={{ width: '60px',  }}
                    />%
                    <button onClick={() => eliminarItem('comisionista', c.id)} className="boton-eliminar">❌</button>
                  </li>
                ))}
              </ul>
            </div>
			</div>
		</div>
            

    
          </div>

        </div>

        <div className="botones">
          <button type="submit">Guardar</button>
          <button type="button" onClick={onCancelar}>Cancelar</button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default FormularioComision