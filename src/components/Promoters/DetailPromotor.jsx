

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from 'axios';

import { getPromoter, createComisionVenta} from "../../api/catalogos.api";
import ComisionVentaLists from "./ListComisionVenta";
import FormularioComision from "./FormComisionVenta";

//import '../CSS/Comisiones.css';
//import { ColumnSizing } from "@tanstack/react-table";

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


    return(
        <div>
            <label>Codigo: {Promoter.code} </label> <p/>
            <label>Promotor: </label>
            < label> {Promoter.name } {Promoter.paternal_surname } {Promoter.maternal_surname}</label> 

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1>Comision de venta </h1>
                <button onClick={() => setMostrarFormulario(true)}> Nueva Comision
                </button>
            </div>

            {mostrarFormulario && (
                <FormularioComision 
                    promotorId={params.id} 
                    onGuardar={agregarComision}
                    onCancelar={() => setMostrarFormulario(false)}
                />
            )}
           
             < ComisionVentaLists promotorId={params.id} /> 
                
        </div>
    )
}