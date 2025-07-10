

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from 'axios';

//import { getPromoter, createComisionVenta} from "../../api/catalogos.api";

import { createComisionVenta } from "../../services/commissions.api";
import { getPromoter } from "../../services/promoters.api";

import ComisionVentaLists from "./ListComisionVenta";
import FormularioComision from "./FormComisionVenta";


export function PromotorDetail() {

    const {
        register,
        handleSubmit, 
        formState: { errors },
        setValue // Poner valores en el formulario
    } = useForm();

    const navigate = useNavigate();
    const params = useParams()
    const [Promoter, setPromoter] = useState([]);


    useEffect(() => {
        async function loadPromoter(){
            if (params.id){
                // const res = await getTask(params.id)
                const obtpromoter = await getPromoter(params.id)
                setPromoter(obtpromoter.data)
                console.log(setPromoter)
                
            }
            else{
                console.log("No hay nada")
            }
        }
        loadPromoter()
    }, [])

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [comisiones, setComisiones] = useState([]);
    
    const agregarComision = async (nuevaDescripcion) => {
    console.log("Detail_Pro:",nuevaDescripcion)
    const nueva = {
        id: comisiones.length + 1,
        descripcion: nuevaDescripcion,
    };
    setComisiones([...comisiones, nueva]);
    setMostrarFormulario(false);
    console.log("Nueva:", nueva)

    try {
        await createComisionVenta(nueva.descripcion)
        
        alert('Datos guardados correctamente');
        console.log(nueva.descripcion)
        } catch (error) {
        console.error(error);
        alert('Error al guardar');
        }

    };

    const buttonClick = () => {
        navigate(`/dashboard/promotor/${params.id}`)
    };
    
    const handleBack = () => {
        navigate(-1); // Esto regresa una página en el historial
    };

    return(
        
        <div >
            <div className="form-rectangulo-head" style={{ alignItems: 'center' }}>
                
                <div className="title-section">

                    <div className="title-row">
                        <h1>Promotor</h1>
                        <h1>{  Promoter.name } {Promoter.paternal_surname } {Promoter.maternal_surname}</h1> 
                        <h2 style={{fontSize: '12px'}}>Tel: {  Promoter.phone } </h2> 
                        <h2 style={{fontSize: '12px'}}>Email: { Promoter.email } </h2>
                        
                    </div>
                    
                </div>

                <div className="button-section">
                    <button  onClick={handleBack} type="button"  className="btn-secondary"> 
                        regresar 
                    </button> 

                    <button onClick={buttonClick}  className="btn-primary"> 
                        Editar
                    </button>
                </div> 

            </div>

            <div className="form-rectangulo" >
                <p className="subtitle" style={{fontWeight:'bold'}}>Listado de comisiones de venta</p>
                
                <button 
                    onClick={() => setMostrarFormulario(true)} 
                    className="btn-primary"
                > Nueva Comision
                
                </button>
        

                {mostrarFormulario && (
                    <FormularioComision 
                        promotorId={params.id} 
                        onGuardar={agregarComision}
                        onCancelar={() => setMostrarFormulario(false)}
                    />
                )}
            
                < ComisionVentaLists promotorId={params.id} /> 
            
            </div>
        </div>
    )
}