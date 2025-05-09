
import { useEffect } from "react";
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { getComisionista, createComisionista, updateComisionista } from "../../api/catalogos.api";

export function ComisionistaFormPage() {

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
            await updateComisionista(params.id, data)
            console.log(data)
            toast.success('Comisionista updated success', {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff",
                },
            })
        } else {
            await createComisionista(data);
            toast.success('Comisioista created success', {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff",
                },
            })
        }
    
        navigate("/dashboard/comisionistas")
    })
    
    useEffect(() => {
        async function load(){
            if (params.id){

                const {
                    data: { code, name, paternal_surname, maternal_surname, notes}
                } = await getComisionista(params.id)
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
        
        <div className="max-w-xl max-auto">
            <h1> Comisionista</h1>
            <form onSubmit={onSubmit}>

                <input 
                    type="text" 
                    placeholder="code" 
                    {...register("code", {required: true})}
                    className="bg-zinc-200 p-3 rounded-lg block w-full mb-3"
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
                {errors.notes && <span>this field is required</span>}
                
                
                <button
                    className="bg-indigo-200 p-3 rounded-lg block w-full mt-3"
                >
                    Save
                </button>
            </form>
        </div>
    )

}