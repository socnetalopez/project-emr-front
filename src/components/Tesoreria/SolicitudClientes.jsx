import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

import SolicitudComisiones from './SolicitudComisiones';
import { getCustomersPromotorId, getCustomerIdRequest } from "../../api/customers.api";
import { getAllCompanies, getBankAccountDetail } from "../../api/companies.api";

import "../CSS/DataTable.css"
import '../CSS/TreasuryMovements.css'


const SolicitudClientes = ({ promotorId, clientesData, setClientesData,  datosComision, setDatosComision }) => {
  

    const [clientesDisponibles, setClientesDisponibles] = useState([]);
    const [clientesSeleccionados, setClientesSeleccionados] = useState([]);
    const [importeComision, setImporteComision] = useState([]);
    const [percentageTax, setPercentageTax] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [cuentasPorEmpresa, setCuentasPorEmpresa] = useState({}); // { empresaId: [cuentas] }

    
    //console.log("Sol_clientes: clientesData", clientesData)
     const convertirClientes = (jsonClients) => {
      return jsonClients.map(client => ({
        cliente: client.customer.id,
        comision_venta: client.customer.comision_venta,
        percentage_sales: client.percentage_sales,
        percentage_commission: client.percentage_commission,
        tipo_calculo: client.customer.tipo_calculo,
        comprobante: client.customer.comprobante,
        tipo_pago: client.customer.tipo_pago,
        importe: client.amount,
        commission: client.commission,
        taxes: client.tax,
        calculoretorno: client.retorno,
        desglose: client.breakdown,
        comisionistas: client.commission_agents,
        tax_percentage: client.tax_percentage,
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
        //nuevos[index].tax = data.tax.name;
        nuevos[index].tax_percentage = data.tax.percentage;
        nuevos[index].tipo_pago = data.tipo_pago.name;
        nuevos[index].comision_venta = data.comision_venta;
        nuevos[index].percentage_commission = data.comision_venta.percentage_commission;
        nuevos[index].percentage_sales = data.comision_venta.percentage_sales;
        //console.log("porcentaje de cliente tax", nuevos[index].taxpercentage = data.tax.percentage)
        //nuevos[index].comision = data.comision_venta.percentage_commission;
        //setImporteComision(data.comision_venta.percentage_commission)
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

        const percentagecomsion = nuevos[index].percentage_commission;
        const percentagesales = nuevos[index].percentage_sales;
        console.log("percentage comision", percentagesales)

        nuevos[index].importe = parseFloat(importe);
        console.log("nuevos", nuevos[index], percentagecomsion)
        
        nuevos[index].totalimportecomision = parseFloat(parseFloat(nuevos[index].importe  *  percentagesales/100));
        nuevos[index].commission = nuevos[index].totalimportecomision;
        console.log("percentgae_tac_actualizar import",percentagecomsion)

        if (percentageTax?.length){
          console.log("Nuevo", percentageTax)
          nuevos[index].taxes = parseFloat((nuevos[index].totalimportecomision) * (percentageTax/100));
        } else{
          console.log("update", nuevos[index].tax_percentage)
          nuevos[index].taxes = parseFloat((nuevos[index].totalimportecomision) * (nuevos[index].tax_percentage/100));
        }
        nuevos[index].calculoretorno = parseFloat(Number((nuevos[index].importe) - (nuevos[index].totalimportecomision) - (nuevos[index].taxes)));
        console.log("actualizar Importe",nuevos)
        setClientesSeleccionados(nuevos);
    };
    
    const eliminarCliente = (index) => {
        const nuevos = clientesSeleccionados.filter((_, i) => i !== index);
        setClientesSeleccionados(nuevos);
    };
      
    //const totalImporte = clientesSeleccionados.reduce((total, clientesSeleccionados) => total + clientesSeleccionados.importe, 0);
    //const totalPComision = clientesSeleccionados.reduce((total, clientesSeleccionados) => total += clientesSeleccionados.totalimportecomision, 0);
    //const totalIVA = clientesSeleccionados.reduce((total, clientesSeleccionados) => total += clientesSeleccionados.taxes, 0);
    //const totalRetorno = clientesSeleccionados.reduce((total, clientesSeleccionados) => total += clientesSeleccionados.calculoretorno, 0);


	useEffect(() => {
		if (clientesData?.length) {
			const clientesConvertidos = convertirClientes(clientesData);
			setClientesSeleccionados(clientesConvertidos); 
		}
    }, [clientesData]);
    //console.log("clientes cobertidos",clientesData, clientesSeleccionados)

    const totales_Importe = clientesSeleccionados.reduce((total, c) => total + Number(c.importe || 0), 0).toLocaleString('es-MX', { minimumFractionDigits: 2 });
    const totales_PComision = clientesSeleccionados.reduce((total, c) => total + Number(c.totalimportecomision || 0), 0).toLocaleString('es-MX', { minimumFractionDigits: 2 });
    const totales_IVA = clientesSeleccionados.reduce((total, c) => total + Number(c.taxes || 0), 0).toLocaleString('es-MX', { minimumFractionDigits: 2 });
    const totales_Retorno = clientesSeleccionados.reduce((total, c) => total + Number(c.calculoretorno || 0), 0).toLocaleString('es-MX', { minimumFractionDigits: 2 });
    const totales_Desglose = clientesSeleccionados.reduce((total, c) => total + Number(c.desglose || 0), 0).toLocaleString('es-MX', { minimumFractionDigits: 2 });

// Cargar empresas al inicio
useEffect(() => {
  getAllCompanies().then(res => setEmpresas(res.data));
}, []);


    const agregarSubitem = (clienteIdx) => {
  const nuevos = [...clientesSeleccionados];
  if (!nuevos[clienteIdx].subitems) nuevos[clienteIdx].subitems = [];
  nuevos[clienteIdx].subitems.push({
    company: '',
    account: '',
    amount: '',
    conciliacion: '',
    cuentasEmpresa: [],
  });
  setClientesSeleccionados(nuevos);
};

// Eliminar subitem
const eliminarSubitem = (clienteIdx, subIdx) => {
  const nuevos = [...clientesSeleccionados];
  nuevos[clienteIdx].subitems.splice(subIdx, 1);
  setClientesSeleccionados(nuevos);
};

// Actualizar subitem
const actualizarSubitem = async (clienteIdx, subIdx, field, value) => {
  const nuevos = [...clientesSeleccionados];
  const subitem = nuevos[clienteIdx].subitems[subIdx];
  subitem[field] = value;

  // Si cambia la empresa, carga cuentas bancarias
  if (field === 'company') {
    const res = await getBankAccountDetail(value);
    subitem.account = '';
    subitem.cuentasEmpresa = res.data;
  }
  setClientesSeleccionados(nuevos);
};

    console.log("al final clientesData", clientesData)
    
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
				<React.Fragment key={index}>
                  <tr style={{ marginBottom: '1rem' }}>
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
					<label>{item.tax_percentage ? parseInt(item.tax_percentage, 10) : ''}</label>
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
						type="text"
						className="input-field"
						value = {(Number(item.commission) || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
						//onChange={(e) => actualizarImporte(index, e.target.value)}
						style={{ width: '100px', }}
					/>
					<label style={{ fontSize: '9px', fontWeight: 'bold' }} >{item.comision}%</label>
				</td>

              <td>
                <input
                    type="number"
                    value = {(Number(item.taxes || 0)).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }
                    className="input-field"
                    style={{ width: '100px', }}
                />
              </td>
              <td>
                <input
                    type="text"
                    value = {(Number(item.calculoretorno || 0)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
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
                <button onClick={() => eliminarCliente(index)}>❌</button>
                <button onClick={() => agregarSubitem(index)} style={{ marginLeft: 8 }}>➕:Empresa</button>
              </td>
            </tr>
                {/* Subitems */}
                {item.subitems && item.subitems.length > 0 && (
                  <tr style={{ background: '#ececec' }}>
                    <td colSpan={11}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 'bold' }}>
                        <span style={{ width: 180 }}>Empresa</span>
                        <span style={{ width: 180 }}>Cuenta</span>
                        <span style={{ width: 100 }}>Monto</span>
                        <span style={{ width: 140 }}>Conciliación</span>
                        <span style={{ width: 80 }}>Acciones</span>
                      </div>
                    </td>
                  </tr>
                )}
                {item.subitems && item.subitems.map((sub, subIdx) => (
                  <tr key={subIdx} style={{ background: '#f9f9f9' }}>
                    <td colSpan={11}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {/* Empresa */}
                        <div className="campo-formulariocustomer" style={{ width: 180 }}>
                          <Select
                            options={empresas.map(emp => ({
                              value: emp.id,
                              label: emp.company_name
                            }))}
                            value={empresas
                              .map(emp => ({ value: emp.id, label: emp.company_name }))
                              .find(opt => opt.value === sub.company) || null}
                            onChange={selected =>
                              actualizarSubitem(index, subIdx, 'company', selected ? selected.value : '')
                            }
                            className="react-select"
                            classNamePrefix="react-select"
                            placeholder="Seleccione Empresa"
                            isClearable
                            isSearchable
                          />
                        </div>
                        {/* Cuenta */}
                        <div className="campo-formulariocustomer" style={{ width: 180 }}>
                          <Select
                            options={(sub.cuentasEmpresa || []).map(acc => ({
                              value: acc.id,
                              label: acc.name
                            }))}
                            value={(sub.cuentasEmpresa || [])
                              .map(acc => ({ value: acc.id, label: acc.name }))
                              .find(opt => opt.value === sub.account) || null}
                            onChange={selected =>
                              actualizarSubitem(index, subIdx, 'account', selected ? selected.value : '')
                            }
                            className="react-select"
                            classNamePrefix="react-select"
                            placeholder="Seleccione Cuenta"
                            isClearable
                            isSearchable
                            isDisabled={!sub.cuentasEmpresa?.length}
                          />
                        </div>
                        {/* Monto */}
                        <input
                          type="number"
                          placeholder="Monto"
                          value={sub.amount}
                          onChange={e => actualizarSubitem(index, subIdx, 'amount', e.target.value)}
                          style={{ width: 100 }}
                        />
                        {/* Conciliación */}
                        <div className="campo-formulariocustomer" style={{ width: 140 }}>
                          <Select
                            options={[
                              { value: '', label: 'Conciliación' },
                              { value: 'conciliado', label: 'Conciliado' },
                              { value: 'no_conciliado', label: 'No conciliado' }
                            ]}
                            value={
                              [
                                { value: '', label: 'Conciliación' },
                                { value: 'conciliado', label: 'Conciliado' },
                                { value: 'no_conciliado', label: 'No conciliado' }
                              ].find(opt => opt.value === sub.conciliacion) || null
                            }
                            onChange={selected =>
                              actualizarSubitem(index, subIdx, 'conciliacion', selected ? selected.value : '')
                            }
                            className="react-select"
                            classNamePrefix="react-select"
                            placeholder="Conciliación"
                            isClearable
                            isSearchable
                          />
                        </div>
                        <button onClick={() => eliminarSubitem(index, subIdx)} style={{ width: 80 }}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
                </React.Fragment>
          )) 
        ):( 
            
        <tr>
                <td colSpan="11" style={{ textAlign: 'center' }}>No hay clientes seleccionados</td>
              </tr>
        )}
        {clientesSeleccionados.length > 0 && (
              <tr style={{ backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>
                <td colSpan="5" style={{ textAlign: 'right' }}>Totales:</td>
                <td>
                  <input
                    value={totales_Importe}
                    className="input-field"
                    style={{ width: '100px' }}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={totales_PComision}
                    className="input-field"
                    style={{ width: '100px' }}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    value={totales_IVA}
                    className="input-field"
                    style={{ width: '100px' }}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    value={totales_Retorno}
                    className="input-field"
                    style={{ width: '100px' }}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    value={totales_Desglose}
                    className="input-field"
                    style={{ width: '100px' }}
                    readOnly
                  />
                </td>
                <td></td>
              </tr>
            )}
          
        </tbody>
        </table>
		</div>
            
          <SolicitudComisiones clientes={clientesSeleccionados} datosComision={datosComision} setDatosComision={setDatosComision} />
        </div>
      );

}



export default SolicitudClientes;
