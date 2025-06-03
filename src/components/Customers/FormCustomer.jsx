

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { getRegimenTipo, getCountry, getStates, getMunicpio, getTipoCalculo, 
        getComprobante, getTax, getTipoPago, getREgimenFiscal, getUsoFactura, 
        getCustomer, createCustomer, updateCustomer } from "../../api/customers.api";

import {getAllPromoters, getComisionVenta } from "../../api/catalogos.api";

//import axios from 'axios';
import '../CSS/FormCustomer.css';


export function CustomerFormPage() {
    
    const {
        register,
        handleSubmit, 
        formState: { errors },
        setValue // Poner valores en el formulario
    } = useForm();

    const navigate = useNavigate();
    const params = useParams()

    const [regimenTipoAll, setregimenTipoAll] = useState([]);
    const [Country_All, setCountry_All] = useState([]);
    const [states_All, setStates_All] = useState([]);
    const [municipios_All, setMunicipios_All] = useState([]);
    const [tipoCalculo_All, setTipoCalulo_All] = useState([]);
    const [comprobante_all, setComprobante_all] = useState([]);
    const [tax_All, setTax_All] = useState([]);
    const [tipoPago_All, setTipoPago_All] = useState([]);
    const [regimenFiscal_All, setRegimenFiscal_All] = useState([]);
    const [usoFactura_All, setUsoFactura_All] = useState([]);
    const [promotores, setpromotores] = useState([]);
    const [comisiones, setComisiones] = useState([]);
    const [comision_venta, setcomision_venta] = useState([]);

    const [code, setCode] = useState();
    const [regimen_tipo, setregimen_tipo] = useState([]);
    const [trade_name, settradename] = useState();
    const [legal_name, setlegalname] = useState();
    const [rfc, setrfc] = useState();
    const [address, setaddress] = useState();
    const [ext_number, setext_number] = useState();
    const [int_number, setint_number] = useState();
    const [district, setdistrict] = useState();
    const [localidad, setlocalidad] = useState();
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [municipio, setMunicipio] = useState([]);
    const [zip, setzip] = useState();
    const [tipo_calculo, setTipoCalculo] = useState([]);
    const [comprobante, setComprobante] = useState([]);
    const [tax, setTax] = useState([]);
    const [tipo_pago, setTipoPago] = useState([]);
    const [regimen_fiscal, setRegimenFiscal] = useState([]);
    const [uso_factura, setuso_factura] = useState([]);
    const [comision, setComision] = useState([]);

    const [promotorSeleccionado, setPromotorSeleccionado] = useState('');
    const [comisionSeleccionado, setComisionSeleccionado] = useState('');

    const [detalle, setDetalle] = useState(null);


    // Obtener los datos de la API
    useEffect(() => {
        const fetchCombo = async () => {
            try {
                const regimentipoResponse = await getRegimenTipo();
                const countryResponse = await getCountry();
                const statesResponse = await getStates();
                const municipiosResponse = await getMunicpio();
                const tipocalculoResponse = await getTipoCalculo();
                const comprobanteResponse = await getComprobante();
                const taxResponse = await getTax();
                const tipopagoResponse = await getTipoPago();
                const regimenfiscalResponse = await getREgimenFiscal();
                const usofacturaResponse = await getUsoFactura();
                const promotoresResponse = await getAllPromoters();
                
                setregimenTipoAll(regimentipoResponse.data);
                setCountry_All(countryResponse.data);
                setStates_All(statesResponse.data);
                setMunicipios_All(municipiosResponse.data);
                setTipoCalulo_All(tipocalculoResponse.data);
                setComprobante_all(comprobanteResponse.data);
                setTax_All(taxResponse.data);
                setTipoPago_All(tipopagoResponse.data);
                setRegimenFiscal_All(regimenfiscalResponse.data);
                setUsoFactura_All(usofacturaResponse.data);
                setpromotores(promotoresResponse.data);
                //setpromotores((await getAllPromoters()).data)

            } catch (error) {
                console.error("Error al cargar los datos", error);
                //setLoading(false);
            }
        };
    
        fetchCombo();
    }, []);



    // ---> Cargar Cliente
    useEffect(() => {
            async function load(){

                if (params.id){
                    try {
                        const Response = await getCustomer(params.id);
                        const data = Response.data
                        setCode(data.code)
                        setregimen_tipo(data.regimen_tipo)
                        settradename(data.trade_name)
                        setlegalname(data.legal_name)
                        setrfc(data.rfc)
                        setaddress(data.address)
                        setext_number(data.ext_number)
                        setint_number(data.int_number)
                        setdistrict(data.district)
                        setlocalidad(data.localidad)
                        setCountry(data.country)
                        setState(data.state)
                        setMunicipio(data.municipio)
                        setzip(data.zip)
                        setTipoCalculo(data.tipo_calculo)
                        setComprobante(data.comprobante)
                        setTax(data.tax)
                        setTipoPago(data.tipo_pago)
                        setRegimenFiscal(data.regimen_fiscal)
                        setuso_factura(data.uso_factura)
                        setPromotorSeleccionado(data.promotor)
                        setcomision_venta(data.comision_venta.id)
                   
            } catch (error) {
                console.error("Error al cargar los datos", error);
            }
        }}
            load()
        }, [])
    
    // <---


    // ---> Cargar comisiones al seleccionar un promotor
    useEffect(() =>  {
        const fetchComision = async () => {
            try {
                const { data } = await getComisionVenta(promotorSeleccionado);
                setComisiones(data)
                console.log("comi", data)

            } catch (error) {
                console.error('Error al obtener las comisiones:', error);
            }
        }

        if (promotorSeleccionado) {
        fetchComision();
        }
    }, [promotorSeleccionado]);
    // <---


    // Combinar nombre completo
    const getNombreCompleto = (persona) =>
    `${persona.name} ${persona.paternal_surname || ''} ${persona.maternal_surname || ''}`.trim();

    

    const onSubmit = handleSubmit( async (e) => {
        
        const promotor = promotorSeleccionado;
        //const comision_venta = comision;
                const data = {
                    code,
                    regimen_tipo,
                    trade_name,
                    legal_name,
                    rfc,
                    address,
                    ext_number,
                    int_number,
                    district,
                    localidad,
                    country,
                    state,
                    municipio,
                    zip,
                    tipo_calculo,
                    comprobante,
                    tax,
                    tipo_pago,
                    regimen_fiscal,
                    uso_factura,
                    promotor,
                    comision_venta,
                }
                
                console.log("save:",e, data)
            if (params.id) {
                await updateCustomer(params.id, data)
                console.log(params.id,"update:",data)
                toast.success('Cliente updated success', {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff",
                    },
                })
            } else {
                await createCustomer(data);
                toast.success('Cliente created success', {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff",
                    },
                })
            }
        
            navigate("/dashboard/customers")
        })

        const handleBack = () => {
        navigate(-1); // Esto regresa una página en el historial
    };

    return(
        <div className="contenedorc">
            <form onSubmit={onSubmit} class="formulariocustomer">

                <div className="headerLayoutSup-Customers">
                    <h2>Clientes : {params.id ? 'Editar' : 'Nuevo'}</h2>
                    <button>
                        {params.id ? 'Actualizar' : 'Guardar'}
                    </button>
                    <button onClick={handleBack} className="btn-cancelar">
                        Regresar
                    </button>
                </div>

                <h2>Datos Generales</h2>

                <div className="input-select-container-customer">
                    <div className="campo-formulariocustomer">
                        <label htmlFor="archivo">Codigo</label>
                        <input 
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Codigo"
                        />
                    </div>

                    <div className="campo-formulariocustomer">
                        <label>Regimen Tipo</label>
                        <select
                            //id="regimen_tipo"
                            //name="regimen_tipo"
                            value={regimen_tipo}
                            onChange={(e) => setregimen_tipo(e.target.value)}
                            required
                        >
                            <option value="">Selecciona el Tipo</option>
                                {regimenTipoAll.map((rt) => (
                            <option key={rt.id} value={rt.id}>
                                {rt.name}
                            </option>
                                ))}
                        </select>
                    </div>
                    
                    <div className="campo-formulariocustomer">
                        <label>Nombre Comercial</label>
                        <input 
                            type="text" 
                            value={trade_name}
                            placeholder="Nombre Comercial"
                            onChange={(e) => settradename(e.target.value)}
                            
                        />
                    </div>

                    <div className="campo-formulariocustomer">
                        <label>Razon Social</label>
                        <input 
                            type="text"
                            value={legal_name}
                            onChange={(e) => setlegalname(e.target.value)}
                            placeholder="Nombre o Razon Social"
                        />
                    </div>

                    <div className="campo-formulariocustomer">
                        <label>RFC</label>
                        <input 
                            type="text" 
                            value={rfc}
                            placeholder="RFC"
                            onChange={(e) => setrfc(e.target.value)}
                        />
                    </div>
                </div>


                <div className="input-select-container-customer">
                    <div className="campo-formulariocustomer">
                        <label>Calle</label>
                        <input 
                            type="text"
                            value={address} 
                            onChange={(e) => setaddress(e.target.value)}
                            placeholder="Calle"
                        />
                    </div>

                    <div className="campo-formulariocustomer">
                        <label>Num. Exterior</label>
                        <input 
                            type="text"
                            value={ext_number}
                            onChange={(e) => setext_number(e.target.value)}
                            placeholder="Numero Exterior"
                        />
                    </div>

                    <div className="campo-formulariocustomer">
                        <label>Num. Interior</label>
                        <input 
                            type="text"
                            value={int_number}
                            placeholder="Numero Interior"
                            onChange={(e) => setint_number(e.target.value)}
                        />
                    </div>

                    <div className="campo-formulariocustomer">
                        <label>Colonia</label>
                        <input 
                            type="text" 
                            value={district}
                            placeholder="Colonia"
                            onChange={(e) => setdistrict(e.target.value)}
                        />
                    </div>

                    <div className="campo-formulariocustomer">
                        <label>Localidad</label>
                        <input 
                            type="text" 
                            value={localidad}
                            placeholder="Localidad"
                            onChange={(e) => setlocalidad(e.target.value)}
                        />
                    </div>
                </div>

                <div className="input-select-container-customer">
                    <div className="campo-formulariocustomer">
                        <label>Pais</label>
                        <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                        >
                            <option value="">Selecciona el Pais</option>
                                {Country_All.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                                ))}
                        </select>
                    </div>

                    <div className="campo-formulariocustomer">
                        <label>Estado</label>
                        <select
                            //id="state"
                            //name="state"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            required
                        >
                            <option value="">Selecciona el Estado</option>
                                {states_All.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                                ))}
                        </select>
                    </div>

                    <div className="campo-formulariocustomer">
                        <label>Municipio</label>
                        <select
                            //id="municipio"
                            //name="municipio"
                            value={municipio}
                            onChange={(e) => setMunicipio(e.target.value)}
                            required
                        >
                            <option value="">Municipio</option>
                                {municipios_All.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}
                            </option>
                                ))}
                        </select>
                    </div>

                    <div className="campo-formulariocustomer">
                        <label>Codigo Postal</label>
                    <input 
                        type="text" 
                        value={zip}
                        onChange={(e) => setzip(e.target.value)}
                        placeholder="Codigo Postal"
                    />
                    </div>
                </div>



                <hr />
                <h2>Datos para Solicitud</h2>
                <div className="input-select-container-customer">
                    <div className="campo-formulariocustomer">
                        <label>Tipo de calculo</label>
                        <select
                            //id="tipo_calculo"
                            //name="tipo_calculo"
                            value={tipo_calculo}
                            onChange={(e) => setTipoCalculo(e.target.value)}
                            required
                        >
                            <option value="">Selecciona</option>
                                {tipoCalculo_All.map((tc) => (
                            <option key={tc.id} value={tc.id}>
                                {tc.name}
                            </option>
                                ))}
                        </select>
                    </div>

                    <div className="campo-formulariocustomer">
                    <label>Comprobante </label>
                        <select
                            //id="comprobante"
                            //name="comprobante"
                            value={comprobante}
                            onChange={(e) => setComprobante(e.target.value)}
                            required
                        >
                            <option value="">Selecciona</option>
                                {comprobante_all.map((co) => (
                            <option key={co.id} value={co.id}>
                                {co.name}
                            </option>
                                ))}
                        </select>
                    </div>

                    <div className="campo-formulariocustomer">
                        <label>Tasa de IVA </label>
                        <select
                            //id="tax"
                            //name="tax"
                            value={tax}
                            onChange={(e) => setTax(e.target.value)}
                            required
                        >
                            <option value="">Selecciona</option>
                                {tax_All.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name}
                            </option>
                                ))}
                        </select>
                    </div>

                    <div className="campo-formulariocustomer">
                        <label>Tipo de Pago </label>
                        <select
                            //id="tipo_pago"
                            //name="tipo_pago"
                            value={tipo_pago}
                            onChange={(e) => setTipoPago(e.target.value)}
                            required
                        >
                            <option value="">Selecciona</option>
                                {tipoPago_All.map((tp) => (
                            <option key={tp.id} value={tp.id}>
                                {tp.name}
                            </option>
                                ))}
                        </select>
                    </div>

                </div>

                <hr />
                <h2>Regimen y Uso de la Factura </h2>
                <div className="input-select-container-customer">
                    <div className="campo-formulariocustomer">
                        <label>Regimen Fiscal</label>
                    <select
                        //id="fiscal_tipo"
                        //name="fiscal_tipo"
                        value={regimen_fiscal}
                        onChange={(e) => setRegimenFiscal(e.target.value)}
                        required
                    >
                        <option value="">Selecciona</option>
                            {regimenFiscal_All.map((rf) => (
                        <option key={rf.id} value={rf.id}>
                            {rf.name}
                        </option>
                            ))}
                    </select>
                    </div>

                    <div className="campo-formulariocustomer">
                        <label> Uso de la Factura </label>                    
                        <select
                            //id="uso_factura"
                            //name="uso_factura"
                            value={uso_factura}
                            onChange={(e) => setuso_factura(e.target.value)}
                            required
                        >
                            <option value="">Selecciona</option>
                                {usoFactura_All.map((uf) => (
                            <option key={uf.id} value={uf.id}>
                                {uf.name}
                            </option>
                                ))}
                        </select>
                    </div>
                </div>

                <hr />
                <h3> <strong> Comisiones </strong> </h3>
                <div className="input-select-container">
                    <div style={{ display: 'flex', flexDirection: 'column',  }}>
                        <label style={{ width: '100px' }} >Promotor </label>
                        <select
                            value={promotorSeleccionado}
                            onChange={(e) => setPromotorSeleccionado(e.target.value)}
                            className="bg-zinc-200 rounded-lg select-field"
                            required
                        >
                            <option value="">Selecciona</option>
                                {promotores.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                                ))}
                        </select>
                    </div>

                    {comisiones.length > 0 && (
                    <>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginTop: '20px' }}>Comisiones</label>
                        <select
                            value={comision_venta} 
                            onChange={(e) => setcomision_venta(e.target.value)}
                            className="bg-zinc-200 rounded-lg select-field"
                            required
                        >
                            <option value="">Selecciona</option>
                            {comisiones.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    </>
                    )}
                    
                    {/* Detalle de Comisión */}
                    {detalle && (
                        <div style={{ display: 'flex', gap: '40px', marginTop: '30px', fontSize:'14px', flexDirection: 'column' }}>
                            {/* Tabla porcentajes */}
                            <table border="1" cellPadding="10">
                                <thead>
                                    <tr>
                                    <th>% Venta</th>
                                    <th>% Costo</th>
                                    <th>% Casa</th>
                                    <th>% Comisión</th>
                                    <th>% Promotor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td>{detalle.percentage_sales}%</td>
                                    <td>{detalle.percentage_cost}%</td>
                                    <td>{detalle.percentage_house}%</td>
                                    <td>{detalle.percentage_commission}%</td>
                                    <td>{detalle.percentage_promotor}%</td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Lista brokers y comisionistas */}
                            <div>
                                <h4>Comisiones</h4>
                                < hr />
                                <table border="1" cellPadding="8" style={{ width: '100%', fontSize:'12px' }}>
                                    <thead>
                                        <tr>
                                        <th>Tipo</th>
                                        <th>Nombre</th>
                                        <th>Comisión (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Brokers */}
                                        {detalle.comision_brokers.map(b => (
                                        <tr key={`broker-${b.id}`}>
                                            <td>Broker</td>
                                            <td style={{width:'500px'}}>{getNombreCompleto(b.broker)}</td>
                                            <td>{b.percentage}%</td>
                                        </tr>
                                        ))}

                                        {/* Comisionistas */}
                                        {detalle.comisionistas.map(c => (
                                        <tr key={`comisionista-${c.id}`}>
                                            <td>Comisionista</td>
                                            <td>{getNombreCompleto(c.comisionista)}</td>
                                            <td>{c.percentage}%</td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/*<ul>
                                {detalle.comision_brokers.map((co, i) => 
                                    <li key={co.id} style={{ width: 400}}>     broker | {co.broker.name} {co.broker.paternal_surname} | {co.percentage}</li>)}
                                
                                {detalle.comisionistas.map((co, i) => <li key={co.id} style={{ width: 400}}>comisionista | {co.comisionista.name} {co.comisionista.paternal_surname} | {co.percentage}</li>)}
                                </ul> */}
                            </div>
                        </div>
                    )}

                </div>
                
            </form>
        </div>
    )
}