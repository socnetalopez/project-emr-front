
import React from 'react';
import { useEffect,  useState } from 'react';


export default function SolicitudComisiones({ clientes, setDatosComision,  datosComision}) {
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
    const [brokers, setBrokers] = useState({});
    const [comisionistas, setComisionistas] = useState({});

    const [totalGeneral, setTotalGeneral] = useState({
        total_com: 0,
        total_tax: 0,
        total_total: 0,
});
    

    console.log("clientes",clientes, "resumen", resumen)
        
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

        const acumuladoBrokers = {};
        const acumuladoComisionistas = {};

        const calcularCosto = (porcentaje, importe, tax) => {
            const costo_com = (porcentaje * importe) / 100;
            const costo_tax = (costo_com * tax) / 100;
            const costo_total = costo_com - costo_tax;
            return { costo_com, costo_tax, costo_total };
        };

        for (const cliente of clientes) {
            const { importe, taxpercentage, id, comision_venta } = cliente;
            const tax = parseFloat(taxpercentage || 0);

            if (!importe || !comision_venta) continue;

            const porcentajeCom = parseFloat(comision_venta.percentage_cost || 0);
            const porcentajeHouse = parseFloat(comision_venta.percentage_house || 0);
            const porcentajePromotor = parseFloat(comision_venta.percentage_promotor || 0);

            const comision = calcularCosto(porcentajeCom, importe, tax);
            const houseCost = calcularCosto(porcentajeHouse, importe, tax);
            const promotorCost = calcularCosto(porcentajePromotor, importe, tax);

            nuevosCostos.push({
                clienteId: id || null,
                comision,
                house: houseCost,
                promotor: promotorCost,
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
            if (Array.isArray(comision_venta.comision_brokers)) {
                for (const broker of comision_venta.comision_brokers) {
                    const porcentaje = parseFloat(broker.percentage || 0);
                    if (!broker.id || !porcentaje) continue;

                    
                    const costo = calcularCosto(porcentaje, importe, tax);
                    if (!acumuladoBrokers[broker.broker.id]) {
                        acumuladoBrokers[broker.broker.id] = {
                            nombre: broker.broker.name || 'Sin nombre',
                            total_com: 0,
                            total_tax: 0,
                            total_total: 0,
                        };
                    }
                    acumuladoBrokers[broker.broker.id].total_com += costo.costo_com;
                    acumuladoBrokers[broker.broker.id].total_tax += costo.costo_tax;
                    acumuladoBrokers[broker.broker.id].total_total += costo.costo_total;
                }
            }

            // Procesar comisionistas
            if (Array.isArray(comision_venta.comisionistas)) {
                for (const comisionista of comision_venta.comisionistas) {
                    const porcentaje = parseFloat(comisionista.percentage || 0);
                    if (!comisionista.id || !porcentaje) continue;

                    const comisionistaId = comisionista.comisionista.id;
                    const nombre = comisionista.comisionista?.name || 'Sin nombre';
                    const costo = calcularCosto(porcentaje, importe, tax);
                    
                    if (!acumuladoComisionistas[comisionistaId]) {
                        acumuladoComisionistas[comisionistaId] = {
                            nombre,
                            total_com: 0,
                            total_tax: 0,
                            total_total: 0,
                        };
                    }
                    acumuladoComisionistas[comisionistaId].total_com += costo.costo_com;
                    acumuladoComisionistas[comisionistaId].total_tax += costo.costo_tax;
                    acumuladoComisionistas[comisionistaId].total_total += costo.costo_total;
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
        totalGeneral.total_com += broker.total_com;
        totalGeneral.total_tax += broker.total_tax;
        totalGeneral.total_total += broker.total_total;
    }

    // Sumar comisionistas
    for (const comisionistaId in acumuladoComisionistas) {
        const comisionista = acumuladoComisionistas[comisionistaId];
        totalGeneral.total_com += comisionista.total_com;
        totalGeneral.total_tax += comisionista.total_tax;
        totalGeneral.total_total += comisionista.total_total;
    }


        setCostosTotales(totales);
        setCostosClientes(nuevosCostos);
        setBrokers(acumuladoBrokers);
        setComisionistas(acumuladoComisionistas);
        setTotalGeneral(totalGeneral)


    }, [clientes]);
    // <----

    useEffect(() => {
          setDatosComision({ costosTotales, brokers, comisionistas, totalGeneral });
        }, [totalCostos, comisionistas, brokers, totalGeneral]);

    clientes.forEach(({ comision_venta, importe, taxpercentage }) => {
      if (!comision_venta || !importe) return;


        // Costo
        const costo_nombre = "Costo"
        const costo_porcentaje = parseFloat(comision_venta.percentage_cost);
        const costo_com = (costo_porcentaje * importe)/100;
        const costo_tax = (costo_com * taxpercentage)/100;
        const costo_total = costo_com - costo_tax;
       

        if (!resumen.costo[costo_nombre]) resumen.costo[costo_nombre] = { costo_com:0 , costo_tax:0, costo_total:0};
        resumen.costo[costo_nombre].costo_com += costo_com;
        resumen.costo[costo_nombre].costo_tax += costo_tax;
        resumen.costo[costo_nombre].costo_total += costo_total;

        
        // Casa
        const casa_nombre = "Casa"
        const casa_porcentaje = parseFloat(comision_venta.percentage_house);
        const casa_com = (casa_porcentaje * importe)/100;
        const casa_tax = (casa_com * taxpercentage)/100;
        const casa_total = casa_com - casa_tax;
       

        if (!resumen.casa[casa_nombre]) resumen.casa[casa_nombre] = { casa_com:0 , casa_tax:0, casa_total:0} ;
        resumen.casa[casa_nombre].casa_com += casa_com;
        resumen.casa[casa_nombre].casa_tax += casa_tax;
        resumen.casa[casa_nombre].casa_total += casa_total;


        // Promotores
        const nombre = comision_venta.promotor.nombre
        const porcentaje = parseFloat(comision_venta.percentage_promotor);
        const com = (porcentaje * importe)/100;
        const tax = (com * taxpercentage)/100;
        const total = com - tax;

        if (!resumen.promotores[nombre]) resumen.promotores[nombre] = { com:0 , tax:0, total:0};
        resumen.promotores[nombre].com += com;
        resumen.promotores[nombre].tax += tax;
        resumen.promotores[nombre].total += total;
            
  
        // Brokers
        comision_venta.comision_brokers.forEach((b) => {
        //const id = b.id;
            const porcentaje = parseFloat(b.percentage);
            const nombre = (b.broker.name+" "+b.broker.paternal_surname+" "+b.broker.maternal_surname);
            const com = (porcentaje * importe)/100;
            const tax = (com * taxpercentage)/100;
            const total = com - tax;

            if (!resumen.brokers[nombre]) resumen.brokers[nombre] ={ com:0 , tax:0, total:0} ;
            resumen.brokers[nombre].com += com;
            resumen.brokers[nombre].tax += tax;
            resumen.brokers[nombre].total += total;

            console.log("brokerresu", resumen.brokers)
        });
  
      // Comisionistas
      comision_venta.comisionistas.forEach((c) => {
        const nombre = c.comisionista.name;
        const porcentaje = parseFloat(c.percentage);
        const com = (porcentaje * importe)/100;
        const tax = (com * taxpercentage)/100;
        const total = com - tax;
  
        if (!resumen.comisionistas[nombre]) resumen.comisionistas[nombre] = { com:0 , tax:0, total:0} ;
        resumen.comisionistas[nombre].com += com;
        resumen.comisionistas[nombre].tax += tax;
        resumen.comisionistas[nombre].total += total;
      });
    });
  
    const totalComisiones = 
        Object.values(resumen.costo).reduce((a, b) => a + b.costo_com, 0) +
        Object.values(resumen.casa).reduce((a, b) => a + b.casa_com, 0) +
        Object.values(resumen.promotores).reduce((a, b) => a + b.com, 0) +
        Object.values(resumen.brokers).reduce((acc, broker) => acc + broker.com, 0) +
        Object.values(resumen.comisionistas).reduce((a, b) => a + b.com, 0);
    
    const totalTax = 
        Object.values(resumen.costo).reduce((a, b) => a + b.costo_tax, 0) +
        Object.values(resumen.casa).reduce((a, b) => a + b.casa_tax, 0) +
        Object.values(resumen.promotores).reduce((a, b) => a + b.tax, 0) +
        Object.values(resumen.brokers).reduce((acc, broker) => acc + broker.tax, 0) +
        Object.values(resumen.comisionistas).reduce((a, b) => a + b.tax, 0);

    const sumTotal = 
        Object.values(resumen.costo).reduce((a, b) => a + b.costo_total, 0) +
        Object.values(resumen.casa).reduce((a, b) => a + b.casa_total, 0) +
        Object.values(resumen.promotores).reduce((a, b) => a + b.total, 0) +
        Object.values(resumen.brokers).reduce((acc, broker) => acc + broker.total, 0) +
        Object.values(resumen.comisionistas).reduce((a, b) => a + b.total, 0);

  
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
                    { Object.entries(resumen.costo).map(([id, val]) => (
                    <tr key={id}> 
                        <td style={{ textAlign: 'center' }}>  </td>
                        <td style={{ textAlign: 'left' }}> {id} </td>
                        <td> 
                            <input
                                value={val.costo_com.toFixed(2)}
                            />
                        </td>
                        <td> 
                            <input
                                value={val.costo_tax}
                            />
                        </td>
                        <td> 
                            <input
                            value={val.costo_total.toFixed(2)} />
                        </td>
                    </tr>
                    ))}

                    
 

                    {/* Casa */}
                    {Object.entries(resumen.casa).map(([id, val]) => (
                    <tr  key={id}> 
                        <td style={{ textAlign: 'center' }}>  </td>
                        <td style={{ textAlign: 'left' }}> {id} </td>
                        <td> 
                            <input
                                value={val.casa_com.toFixed(2)} 
                            />
                        </td>
                        <td> 
                            <input
                                value={val.casa_tax.toFixed(2)} />
                        </td>
                        <td> 
                            <input
                            value={val.casa_total.toFixed(2)} />
                        </td>
                    </tr>
                    ))}
                    
                    {/* Promotores */}
                    {Object.entries(resumen.promotores).map(([id, val]) => (
                    <tr  key={id}> 
                        <td style={{ textAlign: 'center' }}> Promotor</td>
                        <td style={{ textAlign: 'left' }}> {id} </td>
                        <td> 
                            <input
                                value={val.com.toFixed(2)} />
                        </td>
                        <td> 
                            <input
                                value={val.tax.toFixed(2)} />
                        </td>
                        <td> 
                            <input
                            readonly="readonly"
                            value={val.total.toFixed(2)} />
                        </td>
                    </tr>
                    ))}

                    {/* Brokers */}
                    {Object.entries(resumen.brokers).map(([id, val]) => (    
                    <tr key={id}> 
                        <td style={{ textAlign: 'center' }}> Broker </td>
                        <td style={{ textAlign: 'left' }}> {id} </td>
                        <td> 
                            <input
                                value={val.com} />
                        </td>
                        <td> 
                            <input
                                value={val.tax} />
                        </td>
                        <td> 
                            <input
                            value={val.total.toFixed(2)} />
                        </td>
                    </tr>
                    ))}
            
            
                    {/*Comisionistas */}
                    {Object.entries(resumen.comisionistas).map(([id, val]) => (
                    <tr key={id}>
                        <td style={{ textAlign: 'center' }}>Comisionista</td> 
                        <td style={{ textAlign: 'left' }}>{id}</td>
                        <td>
                            <input
                                value={val.com} />
                        </td>
                        <td> 
                            <input
                                value={val.tax} />
                        </td>
                        <td> 
                            <input
                            value={val.total} />
                        </td>
                    </tr>
                    ))}

                    <tr>
                        <td></td>
                        <td>total:</td>
                        <td>
                            <input 
                                value={totalGeneral.total_com.toFixed(2)}
                            />
                        </td>
                        <td>
                            <input 
                                value={totalTax.toFixed(2)}
                            />
                        </td>
                        <td>
                            <input 
                                value={sumTotal.toFixed(2)}
                            />
                        </td>
                    </tr>
                    
                </tbody>
            </table>
    
      </div>
    );
  }
