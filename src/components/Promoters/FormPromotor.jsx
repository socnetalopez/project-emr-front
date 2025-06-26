
import { useEffect } from "react";
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { getPromoter, createPromoter, updatePromoter } from "../../api/catalogos.api";

import '../CSS/FormGeneral.css';

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
            if (!data.code || data.code.trim() === "") {
                data.code = "c000";
                }
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

    const handleBack = () => {
        navigate(-1);
    };


    return(
        
        <div className="container">
            <form onSubmit={onSubmit}>

                <div className="form-rectangulo-head">
                    <div className="title-button-wrapper"> 
                        <h1>
                            {params.id ? 'Editar ' : 'Nuevo '} Promotor 
                        </h1>

                        <button onClick={handleBack}
                            style={{backgroundColor: 'gray'}}
                        > 
                            Regresar
                        </button> 

                        <button 
                            onClick={handleBack}
                            style={{backgroundColor: 'orange'}}
                        > 
                            Desactivar
                        </button> 
                        
                        <button type="submit"> 
                            {params.id ? 'Actualizar' : 'Guardar'} 
                        </button> 
                    </div>
                </div>

            <div className="form-rectangulo">
                {params.id && (
                <div className="form-row row-3 ">
                    <div className="form-group-inline">
                        <input 
                            type="text" 
                            placeholder="Code"
                            {...register("code", {required: true})} 
                            disabled
                        />

                    </div>
                </div>
                )}

                <div className="form-row row-3">
                    <div className="form-group">
                        <label>Nombre(s)</label>
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
                            style={{width : '200px'}}
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
                </div>
                
        
            </div>
            </form>
        </div>
    )

}