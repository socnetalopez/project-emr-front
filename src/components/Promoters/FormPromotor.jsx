
import { useEffect } from "react";
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { getPromoter, createPromoter, updatePromoter } from "../../api/catalogos.api";

export function PromotorFormPage() {

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
            await updatePromoter(params.id, data)
            console.log(data)
            toast.success('Promotor updated success', {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff",
                },
            })
        } else {
            await createPromoter(data);
            toast.success('Promotor created success', {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff",
                },
            })
        }
    
        navigate("/dashboard/promotores")
    })
    
    useEffect(() => {
        async function loadPromoter(){
            if (params.id){
                // const res = await getTask(params.id)
                const {data} = await getPromoter(params.id)
                //console.log(data)
                const {
                    data: {code, name, paternal_surname, maternal_surname, email, phone, notes}
                } = await getPromoter(params.id)
                setValue('code', code)
                setValue('name', name)
                setValue('paternal_surname', paternal_surname)
                setValue('maternal_surname', maternal_surname)
                setValue('email', email)
                setValue('phone', phone)
                setValue('notes', notes)
            }   
        }
        loadPromoter()
    }, [])

    return(
        
        <div className="max-w-xl max-auto">
            <form onSubmit={onSubmit}>

                <input 
                    type="text" 
                    placeholder="Code"
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

                {errors.name && <span>this field is required</span>}


                <input 
                    type="text" 
                    placeholder="Apellido Paterno"
                    {...register("paternal_surname", {required: false})}
                    className="bg-zinc-200 p-3 rounded-lg block w-full mb-3"
                />

                <input 
                    type="text" 
                    placeholder="Apellido Materno"
                    {...register("maternal_surname", {required: false})}
                    className="bg-zinc-200 p-3 rounded-lg block w-full mb-3"
                />

                <input 
                    type="text" 
                    placeholder="Email"
                    {...register("email", {required: false})}
                    className="bg-zinc-200 p-3 rounded-lg block w-full mb-3"
                />

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
                
                <button
                    className="bg-indigo-200 p-3 rounded-lg block w-full mt-3"
                >
                    Save
                </button>
            </form>
        </div>
    )

}