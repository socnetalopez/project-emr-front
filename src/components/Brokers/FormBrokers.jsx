
import { useEffect } from "react";
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getBroker, createBroker, updateBroker } from "../../api/catalogos.api";
import '../CSS/Comisiones.css';
import '../CSS/FormularioCentrado.css';

export function BrokerFormPage() {

    const {
        register,
        handleSubmit, 
        formState: { errors },
        setValue // Poner valores en el formulario
    } = useForm();

    const navigate = useNavigate();
    const params = useParams()

    const onSubmit = handleSubmit( async (data) => {
        if (params.id) {
            await updateBroker(params.id, data)
            console.log(data)
            toast.success('Broker updated success', {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff",
                },
            })
        } else {
            await createBroker(data);
            toast.success('Broker created success', {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff",
                },
            })
        }
    
        navigate("/dashboard/brokers")
    })
    
    useEffect(() => {
        async function load(){
            if (params.id){
                // const res = await getTask(params.id)
                const data = await getBroker(params.id)
                //console.log(data)
                const {
                    data: { code, name, paternal_surname, maternal_surname, notes}
                } = await getBroker(params.id)
                setValue('code', code)
                setValue('name', name)
                setValue('paternal_surname', paternal_surname)
                setValue('maternal_surname', maternal_surname)
                setValue('notes', notes)
            }   
        }
        load()
    }, [])

    return(
        
        
            <div class="contenedorc" >
            <form 
                onSubmit={onSubmit} 
                className="formularioc">
                    <h1>{params.id ? 'Modificar Broker' : 'Nuevo Broker'}</h1>
                <div className="flex justify-end">
                    <button
                        className="bg-red-500 p-3 rounded-lg w-48 mt-3"
                    >
                        Save
                    </button>
                </div>
                <input 
                    type="text" 
                    placeholder="code" 
                    {...register("code", {required: true})}
                    className="bg-zinc-200 p-3 rounded-lg block w-full mb-3"
                    autoFocus
                />
                {errors.code && <span>this field is required</span>}

                <input 
                    type="text" 
                    placeholder="Nombre"
                    {...register("name", {required: true})} 
                    className="bg-zinc-200 p-3 rounded-lg block w-full mb-3"
                />

                {errors.code && <span>this field is required</span>}

                <input 
                    type="text" 
                    placeholder="Apellido Paterno" 
                    {...register("paternal_surname", {required: false})}
                    className="bg-zinc-200 p-3 rounded-lg block w-full mb-3"
                />
                {errors.paternal && <span>this field is required</span>}

                <input 
                    type="text" 
                    placeholder="Apellido Materno" 
                    {...register("maternal_surname", {required: false})}
                    className="bg-zinc-200 p-3 rounded-lg block w-full mb-3"
                />
                {errors.maternal && <span>this field is required</span>}

                <textarea 
                    rows="3" 
                    placeholder="Observaciones"
                    {...register("notes", {required: false})}
                    className="bg-zinc-200 p-3 rounded-lg block w-full mb-3"
                ></textarea>
                
                
            </form>
        </div>


    )

}