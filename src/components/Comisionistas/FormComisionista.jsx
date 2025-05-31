
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
                    data: { code, name, paternal_surname, maternal_surname, phone, email, notes}
                } = await getComisionista(params.id)
                setValue('code', code)
                setValue('name', name)
                setValue('paternal_surname', paternal_surname)
                setValue('maternal_surname', maternal_surname)
                setValue('phone', phone)
                setValue('email', email)
                setValue('notes', notes)
            }   
        }
        load()
    }, [])

    return(
        
        <div className="form-container">
            <form onSubmit={onSubmit}>

            <div className="formulario">
                <div className="title-button-wrapper"> 
                    <h1>
                        {params.id ? 'Editar ' : 'Nuevo'} Comisionista 
                    </h1>

                    <button> Save </button>
                </div>

                <div className="form-row row-3 ">
                    <div className="form-group-inline">
                        <label>Codigo</label>
                        <input 
                            type="text" 
                            placeholder="code" 
                            {...register("code", {required: true})}
                            
                        />
                        {errors.code && <span>this field is required</span>}

                    </div>
                </div>

                <div className="form-row row-3">
                    <div className="form-group">
                        <label>Nombre</label>
                        <input 
                            type="text" 
                            placeholder="Nombre"
                            {...register("name", {required: true})}
                            style={{width : '200px'}}
                            
                        />

                        {errors.name && <span style={{ color: 'red', fontSize: '12px' }}>Este campo es requerido</span>}
                    </div>
                    
                     <div className="form-group">
                        <label>Apellido Paterno</label>
                        <input 
                            type="text" 
                            placeholder="Apellido Paterno" 
                            {...register("paternal_surname", {required: true})}
                            style={{width : '200px'}}
                        />
                        {errors.paternal_surname && <span style={{ color: 'red', fontSize: '12px' }}>Este campo es requerido</span>}
                    </div>
                    
                     <div className="form-group">
                        <label>Apellido Materno</label>
                        <input 
                            type="text" 
                            placeholder="Apellido Materno" 
                            {...register("maternal_surname", {required: true})}
                        />
                        {errors.maternal_surname && <span style={{ color: 'red', fontSize: '12px' }}>Este campo es requerido</span>}
                    </div>
                </div>

                <div className="form-row row-3">
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="text" 
                            placeholder="Email" 
                            {...register("email", {required: false})}
                            style={{width : '200px'}}
                        />
                    </div>
                    <div className="form-group">
                        <label>Telefono</label>
                        <input 
                            type="text" 
                            placeholder="Telefono" 
                            {...register("phone", {required: false})}
                            style={{width : '200px'}}
                        />
                    </div>
                </div>

                <div className="form-group textarea-full">
                    <label>Observaciones</label>
                    <textarea 
                        rows="3"
                        placeholder="Observaciones"
                        {...register("notes", {required: false})}
                        
                    ></textarea>
                    {errors.notes && <span>this field is required</span>}
                </div>

            </div> 
            </form>
        </div>
    )

}