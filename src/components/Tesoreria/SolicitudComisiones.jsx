
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
    
    //useEffect(() => {
    //    if (datosComision) {
            //console.log("datos comision broker", datosComision);
    //        setBrokers(datosComision.brokers);
    //        setComisionistas(datosComision.comisionistas)
    //    }
    //    else{

    //        console.log("new register")
    //    }
    //}, [datosComision]);

    //resumen.comisionistas === datosComision.comisionistas;
    
    //console.log("SolComisiones: clientes",clientes, "resumen", resumen, "datosComision:", datosComision)
    //console.log("initial datosComision",datosComision)
    //console.log("Initial clientes",clientes)
    // --->

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
                    acumuladoBrokers[brokerId].commission += costo.costo_com;
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
                    acumuladoComisionistas[comisionistaId].commission += costo.costo_com;
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
            totalGeneral.commission += broker.commission;
            totalGeneral.tax += broker.tax;
            totalGeneral.retorno += broker.retorno;
        }

        // Sumar comisionistas
        for (const comisionistaId in acumuladoComisionistas) {
            const comisionista = acumuladoComisionistas[comisionistaId];
            totalGeneral.commission += comisionista.commission;
            totalGeneral.tax += comisionista.tax;
            totalGeneral.retorno += comisionista.retorno;
        }

        //console.log("entro al ciclo",datosComision)
        setCostosTotales(totales);
        setCostosClientes(nuevosCostos);
        //setBrokers(acumuladoBrokers);
        //setComisionistas(acumuladoComisionistas);
        setTotalGeneral(totalGeneral)

        console.log("total general: ", totalGeneral)

        // Se asignan los valores de las comision de costo
        datosComision.cost_commission = totales.comision.total_com;
        datosComision.cost_tax = totales.comision.total_tax;
        datosComision.cost_retorno = totales.comision.total_total;
        //console.log("Datos Comision Costo",datosComision.cost_commission)

        // Se asignan los valores de las comision de casa
        datosComision.house_commission = totales.house.total_com;
        datosComision.house_tax = totales.house.total_tax;
        datosComision.house_retorno = totales.house.total_total;

        // Se asignan los valores de las comision de promotor
        datosComision.promoter_commission = totales.promotor.total_com.toFixed(2);
        datosComision.promoter_tax = totales.promotor.total_tax.toFixed(2);
        datosComision.promoter_retorno = totales.promotor.total_total.toFixed(2);
        
        //console.log("acumulados brokers", acumuladoBrokers)
        //console.log("acumulados comisionistas", acumuladoComisionistas)
        datosComision.brokers = acumuladoBrokers;
        datosComision.comisionistas = acumuladoComisionistas;

        datosComision.total_com = totalGeneral.total_com
        datosComision.total_tax = totalGeneral.total_tax
        datosComision.total_retorno = totalGeneral.total_total
        //console.log("dc brokers",datosComision.brokers)

        //if (
        //    (datosComision.brokers && datosComision.brokers.length > 0) ||
        //    (datosComision.comisionistas && datosComision.comisionistas.length > 0)
        //    ) {
            // Hay datos en al menos uno de los dos
        //    console.log("Hay datos en brokers o comisionistas");
        //    console.log(acumuladoBrokers)
        //    } else {
            // Ambos están vacíos o no existen
        //    console.log("No hay datos en brokers ni en comisionistas");
        //    datosComision.brokers = acumuladoBrokers;
        //    datosComision.comisionistas = acumuladoComisionistas;
       // }

    
    }, [clientes]);
    // <----
    

    clientes.forEach(({ comision_venta, importe, taxpercentage }) => {
      if (!comision_venta || !importe) return;


        // Costo
        //const costo_nombre = "Costo"
        //const costo_porcentaje = parseFloat(comision_venta.percentage_cost);
        //const costo_com = (costo_porcentaje * importe)/100;
        //const costo_tax = (costo_com * taxpercentage)/100;
        //const costo_total = costo_com - costo_tax;
       

        //if (!resumen.costo[costo_nombre]) resumen.costo[costo_nombre] = { costo_com:0 , costo_tax:0, costo_total:0};
        //resumen.costo[costo_nombre].costo_com += costo_com;
        //resumen.costo[costo_nombre].costo_tax += costo_tax;
        //resumen.costo[costo_nombre].costo_total += costo_total;

        
        // Casa
        //const casa_nombre = "Casa"
        //const casa_porcentaje = parseFloat(comision_venta.percentage_house);
        //const casa_com = (casa_porcentaje * importe)/100;
        //const casa_tax = (casa_com * taxpercentage)/100;
        //const casa_total = casa_com - casa_tax;
       

        //if (!resumen.casa[casa_nombre]) resumen.casa[casa_nombre] = { casa_com:0 , casa_tax:0, casa_total:0} ;
       // resumen.casa[casa_nombre].casa_com += casa_com;
        //resumen.casa[casa_nombre].casa_tax += casa_tax;
        //resumen.casa[casa_nombre].casa_total += casa_total;


        // Promotores
        //const nombre = comision_venta.promotor.nombre
        //const porcentaje = parseFloat(comision_venta.percentage_promotor);
        //const com = (porcentaje * importe)/100;
        //const tax = (com * taxpercentage)/100;
        //const total = com - tax;

        //if (!resumen.promotores[nombre]) resumen.promotores[nombre] = { com:0 , tax:0, total:0};
        //resumen.promotores[nombre].com += com;
        //resumen.promotores[nombre].tax += tax;
        //resumen.promotores[nombre].total += total;
            

  
      // Comisionistas
      //comision_venta.comisionistas.forEach((c) => {
    //    const nombre = c.comisionista.name;
    //    const porcentaje = parseFloat(c.percentage);
    //    const com = (porcentaje * importe)/100;
    //    const tax = (com * taxpercentage)/100;
    //    const total = com - tax;
  
    //    if (!resumen.comisionistas[nombre]) resumen.comisionistas[nombre] = { com:0 , tax:0, total:0} ;
    //    resumen.comisionistas[nombre].com += com;
    //    resumen.comisionistas[nombre].tax += tax;
    //    resumen.comisionistas[nombre].total += total;
    //  });

    });
  
    //const totalComisiones = 
    //    Object.values(resumen.costo).reduce((a, b) => a + b.costo_com, 0) +
    //    Object.values(resumen.casa).reduce((a, b) => a + b.casa_com, 0) +
    //    Object.values(resumen.promotores).reduce((a, b) => a + b.com, 0) +
        //Object.values(resumen.brokers).reduce((acc, broker) => acc + broker.com, 0) +
    //    Object.values(resumen.comisionistas).reduce((a, b) => a + b.com, 0);
    
    //const totalTax = 
    //    Object.values(resumen.costo).reduce((a, b) => a + b.costo_tax, 0) +
    //    Object.values(resumen.casa).reduce((a, b) => a + b.casa_tax, 0) +
    //    Object.values(resumen.promotores).reduce((a, b) => a + b.tax, 0) +
    //    //Object.values(resumen.brokers).reduce((acc, broker) => acc + broker.tax, 0) +
    //    Object.values(resumen.comisionistas).reduce((a, b) => a + b.tax, 0);

    //const sumTotal = 
    //    Object.values(resumen.costo).reduce((a, b) => a + b.costo_total, 0) +
    //    Object.values(resumen.casa).reduce((a, b) => a + b.casa_total, 0) +
    //    Object.values(resumen.promotores).reduce((a, b) => a + b.total, 0) +
        //Object.values(resumen.brokers).reduce((acc, broker) => acc + broker.total, 0) +
    //    Object.values(resumen.comisionistas).reduce((a, b) => a + b.total, 0);

    
    //console.log("resumen promotores", valPromoter)
    

    return (
        <div style={{ marginTop: '2rem' }}>
            <h3>Costo, Casa y Comisiones</h3>
            <hr />
            <table className="table-sin-borde">
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
                                value={ Number(datosComision.promoter_commission || 0 ).toFixed(2)} />
                        </td>
                        <td> 
                            <input
                                value={ Number(datosComision.promoter_tax || 0 ).toFixed(2)} />
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
                                value={val.commission.toFixed(2)} />
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
                                value={ Number(datosComision.total_com || 0 ).toFixed(2)}
                            />
                        </td>
                        <td>
                            <input 
                                value={ Number(datosComision.total_tax || 0 ).toFixed(2)}
                            />
                        </td>
                        <td>
                            <input 
                                value={ Number(datosComision.total_retorno || 0 ).toFixed(2)}
                            />
                        </td>
                    </tr>
                    
                </tbody>
            </table>
    
      </div>
    );
    
  }
