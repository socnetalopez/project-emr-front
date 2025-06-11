
import React from 'react';
import { useEffect,  useState } from 'react';


export default function SolicitudComisiones({ clientes, datosComision, setDatosComision}) {
    const resumen = {
      brokers: {},
      comisionistas: {},
      promotores: {},
      casa: {},
      costo: {},
    };

    const [datos, setDatos] = useState([]);
    const [totales, setTotales] = useState({ sumaComisiones: 0, sumaIVA: 0, sumaTotal: 0 });
    //const [percentageTax, setPercentageTax] = useState();
    const [costos, setCostos] = useState(0);
    const [totalCostos, settotalCostos] = useState(0);
    const [house, setHouse] = useState(0);
    const [costosClientes, setCostosClientes] = useState([]);
    const [brokers, setBrokers] = useState([]);
    const [comisionistas, setComisionistas] = useState([]);
    const [valPromoter, setValPromoter] = useState({nombre : '', promotorCost: '' });


    const [totalGeneral, setTotalGeneral] = useState({
        total_com: 0,
        total_tax: 0,
        total_total: 0,
    });
    

    const [costosTotales, setCostosTotales] = useState({
        comision: { total_com: 0, total_tax: 0, total_total: 0 },
        house: { total_com: 0, total_tax: 0, total_total: 0 },
        promotor: { total_com: 0, total_tax: 0, total_total: 0 },
    });


    useEffect(() => {
       
        const nuevosCostos = [];
        const totales = {
            comision: { total_com: 0, total_tax: 0, total_total: 0 },
            house: { total_com: 0, total_tax: 0, total_total: 0 },
            promotor: { total_com: 0, total_tax: 0, total_total: 0 },
        };

        const acumuladoBrokers = [];
        const acumuladoComisionistas = [];

        const calcularCosto = (porcentaje, importe, tax) => {
            const costo_com = (porcentaje * importe) / 100;
            const costo_tax = (costo_com * tax) / 100;
            const costo_total = costo_com - costo_tax;
            return { costo_com, costo_tax, costo_total };
        };
        console.log("clientes", clientes)
        for (const cliente of clientes) {
            const { importe, taxpercentage, id, comision_venta } = cliente;
            const tax = parseFloat(taxpercentage || 0);
            console.log("importe | com venta", importe, comision_venta)
            if (!importe || !comision_venta) continue;
                

            const porcentajeCom = parseFloat(comision_venta.percentage_cost || 0);
            const porcentajeHouse = parseFloat(comision_venta.percentage_house || 0);
            const porcentajePromotor = parseFloat(comision_venta.percentage_promotor || 0);

            const comision = calcularCosto(porcentajeCom, importe, tax);
            const houseCost = calcularCosto(porcentajeHouse, importe, tax);
            const promotorCost = calcularCosto(porcentajePromotor, importe, tax);
            
            //console.log("comisioncosto",comision)
            

            nuevosCostos.push({
                clienteId: id || null,
                comision,
                house: houseCost,
                promotor: {promotorCost},
            });
            
            
            // Acumular totales
            const tipos = { comision, house: houseCost, promotor: promotorCost };
            for (const tipo in tipos) {
                const costo = tipos[tipo];
                if (!costo) continue;
                totales[tipo].total_com += costo.costo_com;
                totales[tipo].total_tax += costo.costo_tax;
                totales[tipo].total_total += costo.costo_total;
            }
            
            
            // Procesar brokers
            if (Array.isArray(cliente.comision_venta.comision_brokers)) {
                for (const broker of cliente.comision_venta.comision_brokers) {
                    const porcentaje = parseFloat(broker.percentage || 0);

                    if (!broker.id || !porcentaje) continue;

                    const brokerId = broker.broker?.id || broker?.bid;
                    const nombre = broker.broker?.name || broker?.name || 'Sin nombre';
                    const fullname = `${nombre} ${broker.broker?.paternal_surname || broker?.paternal_surname} ${broker.broker?.maternal_surname || broker?.maternal_surname}`;
                    const costo = calcularCosto(porcentaje, importe, tax);

                    if (!acumuladoBrokers[brokerId]) {
                        acumuladoBrokers[brokerId] = {
                            brokerId,
                            fullname,
                            commission: 0,
                            tax: 0,
                            retorno: 0,
                        };
                    }
                    acumuladoBrokers[brokerId].commission += parseFloat(costo.costo_com.toFixed(2));
                    acumuladoBrokers[brokerId].tax += costo.costo_tax;
                    acumuladoBrokers[brokerId].retorno += costo.costo_total;

                }

            }
            // -----

            // Procesar comisionistas
            //console.log("cliente comvta comisionista", cliente.comision_venta.comisionistas)
            if (Array.isArray(cliente.comision_venta.comisionistas)) {
                for (const comisionista of cliente.comision_venta.comisionistas) {
                    const porcentaje = parseFloat(comisionista.percentage || 0);
                    
                    if (!comisionista.id || !porcentaje) continue;

                    const comisionistaId = comisionista.comisionista?.id || comisionista?.cid;
                    const nombre = comisionista.comisionista?.name || comisionista?.name || 'Sin nombre';
                    const fullname = `${nombre} ${comisionista.comisionista?.paternal_surname || comisionista?.paternal_surname} ${comisionista.comisionista?.maternal_surname || comisionista?.maternal_surname}`;
                    const costo = calcularCosto(porcentaje, importe, tax);
                    
                    if (!acumuladoComisionistas[comisionistaId]) {
                        acumuladoComisionistas[comisionistaId] = {
                            comisionistaId,
                            fullname,
                            commission: 0,
                            tax: 0,
                            retorno: 0,
                        };
                    }
                    
                    let costo_com = parseFloat(costo.costo_com)
                    acumuladoComisionistas[comisionistaId].commission += parseFloat(costo_com.toFixed(2));
                    acumuladoComisionistas[comisionistaId].tax += costo.costo_tax;
                    acumuladoComisionistas[comisionistaId].retorno += costo.costo_total;
                }
            }
        }

        // Total general sumando comisiones, house, promotor, brokers y comisionistas
        const totalGeneral = {
            total_com: 0,
            total_tax: 0,
            total_total: 0,
        };

        // Sumar comisiones directas (comision, house, promotor)
        for (const tipo in totales) {
            totalGeneral.total_com += totales[tipo].total_com;
            totalGeneral.total_tax += totales[tipo].total_tax;
            totalGeneral.total_total += totales[tipo].total_total;
        }

        // Sumar brokers
        for (const brokerId in acumuladoBrokers) {
            const broker = acumuladoBrokers[brokerId];
            if (totalGeneral.commission === undefined) {
                totalGeneral.commission = 0;
            }
           // console.log("broker comision", broker.commission)
            //totalGeneral.commission += parseFloat(broker.commission);
            totalGeneral.total_com += broker.commission;
            totalGeneral.tax += broker.tax;
            totalGeneral.retorno += broker.retorno;
        }

        // Sumar comisionistas
        for (const comisionistaId in acumuladoComisionistas) {
            const comisionista = acumuladoComisionistas[comisionistaId];
            if (totalGeneral.total_com === undefined) {
                totalGeneral.total_com = 0;
            }
            //totalGeneral.commission += comisionista.commission.toFixed(2);
            totalGeneral.total_com += parseFloat(comisionista.commission);
            totalGeneral.tax += comisionista.tax.toFixed(2);
            totalGeneral.retorno += comisionista.retorno.toFixed(2);
        }



        //console.log("entro al ciclo",datosComision)
        setCostosTotales(totales);
        setCostosClientes(nuevosCostos);
        //setBrokers(acumuladoBrokers);
        //setComisionistas(acumuladoComisionistas);
        //setTotalGeneral(totalGeneral)

       // console.log("total general: ", totalGeneral)
       // console.log("totales: ", totales)
       // console.log("nuevos Costos: ", nuevosCostos)

        // Se asignan los valores de las comision de costo
        datosComision.cost_commission = totales.comision.total_com.toFixed(2);
        datosComision.cost_tax = totales.comision.total_tax.toFixed(2);
        datosComision.cost_retorno = totales.comision.total_total.toFixed(2);
        //console.log("Datos Comision Costo",datosComision.cost_commission)

        // Se asignan los valores de las comision de casa
        datosComision.house_commission = totales.house.total_com.toFixed(2);
        datosComision.house_tax = totales.house.total_tax.toFixed(2);
        datosComision.house_retorno = totales.house.total_total.toFixed(2);

        // Se asignan los valores de las comision de promotor
        datosComision.promoter_commission = totales.promotor.total_com.toFixed(2);
        datosComision.promoter_tax = totales.promotor.total_tax.toFixed(2);
        datosComision.promoter_retorno = totales.promotor.total_total.toFixed(2);
        
        //console.log("acumulados brokers", acumuladoBrokers)
        //console.log("acumulados comisionistas", acumuladoComisionistas)
        datosComision.brokers = acumuladoBrokers;
        datosComision.comisionistas = acumuladoComisionistas;

        datosComision.total_com = totalGeneral.total_com
        datosComision.total_tax = totalGeneral.total_tax;
        datosComision.total_retorno = totalGeneral.total_total;
        //console.log("total_comision", datosComision.total_com)


    
    }, [clientes]);
    // <----
    

    //clientes.forEach(({ comision_venta, importe, taxpercentage }) => {
    //  if (!comision_venta || !importe) return;

  
    //});
    

    return (
        <div className="formulario-rectangulo-movements">
        
            <h3>Costo, Casa y Comisiones</h3>
           
            <table>
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Nombre</th>
                        <th>Comision</th>
                        <th>Distribucion de IVA</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>

                    {/* Costo */}
                    
                    <tr> 
                        <td style={{ textAlign: 'center' }}> Costo  </td>
                        <td style={{ textAlign: 'left' }}>  </td>
                        <td> 
                            <input
                                value={datosComision.cost_commission}
                            />
                        </td>
                        <td> 
                            <input
                                value={datosComision.cost_tax}
                            />
                        </td>
                        <td> 
                            <input
                            value={datosComision.cost_retorno} />
                        </td>
                    </tr>

                    
 

                    {/* Casa */}
                    
                    <tr> 
                        <td style={{ textAlign: 'center' }}> Casa  </td>
                        <td style={{ textAlign: 'left' }}> </td>
                        <td> 
                            <input
                                value={datosComision.house_commission} 
                            />
                        </td>
                        <td> 
                            <input
                                value={datosComision.house_tax} />
                        </td>
                        <td> 
                            <input
                            value={datosComision.house_retorno} />
                        </td>
                    </tr>
                  
                    
                    {/* Promotores */}
                    
                    
                    <tr> 
                        <td style={{ textAlign: 'center' }}> Promotor</td>
                        <td style={{ textAlign: 'left' }}> {datosComision.promoter_fullname} </td>
                        <td> 
                            <input
                                value={ Number(datosComision.promoter_commission || 0 )} />
                        </td>
                        <td> 
                            <input
                                value={ Number(datosComision.promoter_tax || 0 )} />
                        </td>
                        <td> 
                            <input
                            //readonly="readonly"
                            value={ datosComision.promoter_retorno || 0} />
                        </td>
                    </tr>
                    

                    {/* Brokers */}
                    { (datosComision?.brokers) &&
                    Object.entries(datosComision?.brokers).map(([id, val]) => (    
                    <tr key={id}> 
                        <td style={{ textAlign: 'center' }}> Broker </td>
                        <td style={{ textAlign: 'left' }}> {val.fullname} </td>
                        <td> 
                            <input
                                value={val.commission || ''} />
                        </td>
                        <td> 
                            <input
                                value={val.tax} />
                        </td>
                        <td> 
                            <input
                            value={val.retorno} />
                        </td>
                    </tr>
                    ))}
            
            
                    {/*Comisionistas */}
                    {(datosComision?.comisionistas || comisionistas) &&
                     Object.entries(datosComision?.comisionistas || comisionistas).map(([id, val]) => (
                        <tr key={id}>
                        <td style={{ textAlign: 'center' }}>Comisionista</td> 
                        <td style={{ textAlign: 'left' }}>{val.fullname}</td>
                        <td>
                            <input
                                value={val.commission} />
                        </td>
                        <td> 
                            <input
                                value={val.tax} />
                        </td>
                        <td> 
                            <input
                            value={val.retorno} />
                        </td>
                    </tr>
                    ))}


                    <tr>
                        <td></td>
                        <td>total:</td>
                        <td>
                            <input 
                                value={ Number(datosComision.total_com || 0 )}
                            />
                        </td>
                        <td>
                            <input 
                                value={ Number(datosComision.total_tax || 0 )}
                            />
                        </td>
                        <td>
                            <input 
                                value={ Number(datosComision.total_retorno || 0 )}
                            />
                        </td>
                    </tr>
                    
                </tbody>
            </table>
    
      </div>
     
    );
    
  }
