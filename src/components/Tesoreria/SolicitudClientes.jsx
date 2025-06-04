import React, { useEffect, useState } from 'react';
import axios from 'axios';

import SolicitudComisiones from './SolicitudComisiones';
import { getCustomersPromotorId, getCustomerIdRequest } from "../../api/customers.api";

import "../CSS/DataTable.css"
import '../CSS/TreasuryMovements.css'


const SolicitudClientes = ({ promotorId, clientesData, setClientesData,  datosComision, setDatosComision }) => {
  

    const [clientesDisponibles, setClientesDisponibles] = useState([]);
    const [clientesSeleccionados, setClientesSeleccionados] = useState([]);
    const [importeComision, setImporteComision] = useState([]);
    const [percentageTax, setPercentageTax] = useState([]);

    
    //console.log("Sol_clientes: clientesData", clientesData)
     const convertirClientes = (jsonClients) => {
		return jsonClients.map(client => ({
			cliente: client.customer.id,
      comision: client.commission,
      comision_venta: client.customer.comision_venta,
			tipo_calculo: client.customer.tipo_calculo,
			comprobante: client.customer.comprobante,
			tipo_pago: client.customer.tipo_pago,
			importe: client.amount,
			totalimportecomision: client.commission,
			taxes: client.tax,
			calculoretorno: client.retorno,
			desglose: client.breakdown,
      comisionistas: client.commission_agents
			
			}));
		};
  
    //console.log("Initial clientes",clientesData)
    //console.log("datos com", datosComision)
    //console.log("prmotorID",promotorId.id)

    useEffect(() => {
      setClientesData({ clientesSeleccionados });
    }, [clientesSeleccionados]);

    

    useEffect(() => {
        const fetchClientsAvailable = async () => {
            try {
              //console.log("promotorId", promotorId.id)
              const { data }  = await getCustomersPromotorId(promotorId.id)
              setClientesDisponibles(data);
              //console.log("clientes Disponibles", clientesDisponibles)
              
            }catch(error) {
                console.error("Error al cargar los datos", error);

            }
        }
        if (promotorId) {
          fetchClientsAvailable();
        }
    }, [promotorId]);
      
    //setClientesSeleccionados(clientesData)
    
    const agregarCliente = () => {
    setClientesSeleccionados([
        ...clientesSeleccionados,
        { cliente: null, importe: 0, comision_venta: null }
    ]);
    console.log(promotorId, '-- -- ',clientesSeleccionados)
    };
    
    const actualizarCliente = async (index, clienteId) => {
        const { data } = await getCustomerIdRequest(clienteId)
        const nuevos = [...clientesSeleccionados];
        nuevos[index].cliente = clienteId;
        nuevos[index].tipo_calculo = data.tipo_calculo.name;
        nuevos[index].comprobante = data.comprobante.name;
        nuevos[index].tax = data.tax.name;
        nuevos[index].taxpercentage = data.tax.percentage;
        nuevos[index].tipo_pago = data.tipo_pago.name;
        nuevos[index].comision_venta = data.comision_venta;
        nuevos[index].comision = data.comision_venta.percentage_commission;
        //nuevos[index].comision = data.comision_venta.percentage_commission;
        setImporteComision(data.comision_venta.percentage_sales)
        setPercentageTax(data.tax.percentage)

        // Reset valores de brokers y comisionistas
        datosComision.brokers = '';
        datosComision.comisionistas='';
        nuevos[index].importe = 0;
        nuevos[index].taxes = 0;
        nuevos[index].calculoretorno = 0;
        nuevos[index].totalimportecomision = 0;


        console.log("Actualizar cliente", nuevos)
        setClientesSeleccionados(nuevos);
        };

    const actualizarImporte = (index, importe) => {
      
        const nuevos = [...clientesSeleccionados];

        const percentagecomsion = nuevos[index].comision;

        nuevos[index].importe = parseFloat(importe);
        //console.log(importe,"index", index)
        //console.log("nuevos", nuevos[index])

        nuevos[index].totalimportecomision = parseFloat(parseFloat(nuevos[index].importe  *  percentagecomsion/100).toFixed(2));
        //nuevos[index].totalimportecomision = parseFloat(parseFloat(nuevos[index].importe  *  nuevos[index].comsion/100));
        nuevos[index].taxes = parseFloat((nuevos[index].totalimportecomision) * (percentageTax/100));
        nuevos[index].calculoretorno = parseFloat(Number((nuevos[index].importe) - (nuevos[index].totalimportecomision) - (nuevos[index].taxes)).toFixed(2));
        console.log("actualizar Importe",nuevos)
        setClientesSeleccionados(nuevos);
    };
    
    const eliminarCliente = (index) => {
        const nuevos = clientesSeleccionados.filter((_, i) => i !== index);
        setClientesSeleccionados(nuevos);
    };
      
    const totalImporte = clientesSeleccionados.reduce((total, clientesSeleccionados) => total + clientesSeleccionados.importe, 0);
    const totalPComision = clientesSeleccionados.reduce((total, clientesSeleccionados) => total += clientesSeleccionados.totalimportecomision, 0);
    const totalIVA = clientesSeleccionados.reduce((total, clientesSeleccionados) => total += clientesSeleccionados.taxes, 0);
    const totalRetorno = clientesSeleccionados.reduce((total, clientesSeleccionados) => total += clientesSeleccionados.calculoretorno, 0);


	useEffect(() => {
		if (clientesData?.length) {
			const clientesConvertidos = convertirClientes(clientesData);
			setClientesSeleccionados(clientesConvertidos);
			//console.log("clientes cobertidos",clientesData, clientesConvertidos, clientesSeleccionados)
		}
    }, [clientesData]);

    
    //console.log("al final clientesData", clientesData)
    
      return (
		<div>
        <div className="formulario-rectangulo-movements">
        	<h3>Clientes y Retornos 
            <button onClick={agregarCliente}>Agregar</button>
          	</h3>
          
			<table className="table-sin-borde">
			<thead>
				<tr>
				<th>Cliente</th>
				<th>Tipo de Calculo</th>
				<th>Comprobante</th>
				<th>Tasa de IVA</th>
				<th>Tipo de Pago</th>
				<th>Importe Nominal</th>
				<th>% Comision</th>
				<th>% IVA</th>
				<th>Retorno</th>
				<th>Desglose</th>
				<th></th>
				</tr>
			</thead>

          	<tbody>
          
			{ clientesSeleccionados.length > 0 ? (
				clientesSeleccionados.map((item, index) => (
				<tr key={index} style={{ marginBottom: '1rem' }}>
				<td>
					<select
						value={item.cliente || ''}
						onChange={(e) => actualizarCliente(index, e.target.value)}
					>
						<option value="">Seleccione Cliente</option>
							{clientesDisponibles.map((cliente) => (
						<option key={cliente.id} value={cliente.id}>
							{cliente.trade_name}
						</option>
							))}
					</select>
				</td>

				<td>
					<label> {item.tipo_calculo || ''} </label>
				</td>
				<td>
					<label> {item.comprobante || ''} </label>
				</td>
				<td>
					<label> {item.tax || ''} </label>
				</td>
				<td>
					<label> {item.tipo_pago || ''} </label>
				</td>
				<td>  
					<input
						type="number"
						placeholder="Importe"
						min="0" pattern="^[0-9]+"
						value={item.importe}
						onChange={(e) => actualizarImporte(index, e.target.value)}
						className="input-field"
						style={{ width: '100px', }}
					/>
				</td>
              
				<td>
					<input
						type="number"
						className="input-field"
						value = {item.totalimportecomision}
						//onChange={(e) => actualizarImporte(index, e.target.value)}
						style={{ width: '100px', }}
					/>
					<label style={{ fontSize: '9px', fontWeight: 'bold' }} >{item.comision}%</label>
				</td>

              <td>
                <input
                    type="number"
                    value = {item.taxes}
                    className="input-field"
                    style={{ width: '100px', }}
                />
              </td>
              <td>
                <input
                    type="number"
                    value = {item.calculoretorno}
                    className="input-field"
                    style={{ width: '100px', }}
                />
              </td>
              <td>
                <input
                    type="number"
					value={item.desglose}
                    className="input-field"
                    style={{ width: '100px', }}
                />
              </td>
              
              <td>
                <button 
                  onClick={() => eliminarCliente(index)} 
                >
                  ❌
                </button>
              </td>
            </tr>
                
          )) ):( 
        
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
                <input
                    type="number"
                    value = {totalImporte}
                    className="input-field"
                    style={{ width: '100px', }} />
            </td>
            <td>
                <input
                    type="number"
                    value = {totalPComision}
                    className="input-field"
                    style={{ width: '100px', }} />
            </td>
            <td>
                <input
                    type="number"
                    value = {totalIVA}
                    className="input-field"
                    style={{ width: '100px', }} />
            </td>
            <td>
                <input
                    type="number"
                    value = {totalRetorno}
                    className="input-field"
                    style={{ width: '100px', }} />
            </td>
            <td>
                <input
                    className="input-field"
                    style={{ width: '100px', }} />
            </td>
          </tr> )}
        </tbody>
        </table>
		</div>
            
          <SolicitudComisiones clientes={clientesSeleccionados} datosComision={datosComision} setDatosComision={setDatosComision} />
        </div>
      );

}



export default SolicitudClientes;
