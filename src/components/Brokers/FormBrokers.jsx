
import { useEffect } from "react";
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getBroker, createBroker, updateBroker } from "../../api/catalogos.api";
//import '../CSS/Comisiones.css';
//import '../CSS/FormularioCentrado.css';
import '../CSS/FormGeneral.css';

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
             <div className="form-container">
            <form 
                onSubmit={onSubmit} 
            >
                   
        
                    <h1>{params.id ? 'Modificar Broker' : 'Nuevo Broker'}</h1>
                <div className="">
                    <button
                        className="bg-red-500  rounded-lg w-48 mt-3"
                    >
                        Save
                    </button>
                </div>
                
                <div className="formulario">
                <label className="block text-gray-700 font-medium mb-2">Codigo</label>
                <input 
                    type="text" 
                    placeholder="code" 
                    {...register("code", {required: true})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 "
                    autoFocus
                />
                {errors.code && <span>this field is required</span>}
                </div>

                <div className="form-row row-3">
                     <div className="form-group">
                        <label>Nombre</label>
                        <input 
                            type="text" 
                            placeholder="Nombre"
                            {...register("name", {required: true})} 
                        />

                        {errors.code && <span>this field is required</span>}

                    </div>
                    <div className="form-group">
                        <label>Apellido Paterno</label>
                            <input 
                                type="text" 
                                placeholder="Apellido Paterno" 
                                {...register("paternal_surname", {required: false})}
                            />
                            {errors.paternal && <span>this field is required</span>}
                    </div>
                    <div className="form-group">
                        <label>Apellido Materno</label>
                        <input 
                            type="text" 
                            placeholder="Apellido Materno" 
                            {...register("maternal_surname", {required: false})}
                            
                        />
                        {errors.maternal && <span>this field is required</span>}
                        </div>
                </div>
                <label>Email</label>
                <input 
                    type="text" 
                    placeholder="Email" 
                    {...register("email", {required: false})}
                    className="bg-zinc-200 p-3 rounded-lg block w-full mb-3"
                />

                <label>Telefono</label>
                <input 
                    type="text" 
                    placeholder="Telefono" 
                    {...register("phone", {required: false})}
                    className="bg-zinc-200 p-3 rounded-lg block w-full mb-3"
                />

                <textarea 
                    rows="3" 
                    placeholder="Observaciones"
                    {...register("notes", {required: false})}
                    className="bg-zinc-200 p-3 rounded-lg block w-full mb-3"
                ></textarea>
                
            
            </form>
        </div>
        </div>
        


    )

}