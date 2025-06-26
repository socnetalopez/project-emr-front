

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from 'axios';

import { getPromoter, createComisionVenta} from "../../api/catalogos.api";
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

    /*const agregarComision = (nueva) => {
        const nuevaComision = {
          ...nueva,
          id: Date.now()
        };
        setComisiones([nuevaComision, ...comisiones]);
        setMostrarFormulario(false); // Ocultar formulario después de guardar
      }; */
    
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

                <h1 style={{fontSize:'20px'}}>
                    Promotor: {  Promoter.name } {Promoter.paternal_surname } {Promoter.maternal_surname}
                </h1>
                
                <button  onClick={handleBack} style={{marginLeft: '10px'}}>
                    Regresar
                </button>
                
                <button  onClick={buttonClick} style={{marginLeft: '10px'}}>
                    Editar Promotor
                </button>

            </div>

            <div className="form-rectangulo" >
                <label style={{fontSize:'16px'}}> Comision de venta </label>
                <button onClick={() => setMostrarFormulario(true)}> Nueva Comision
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