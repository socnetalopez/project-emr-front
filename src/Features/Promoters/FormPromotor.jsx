
import { useEffect } from "react";
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

import { getPromoter, createPromoter, updatePromoter } from "../../services/promoters.api";

import '../../components/css/CustomForm.css';


export function PromotorFormPage() {

    const {
        register,
        handleSubmit, 
        formState: { errors },
        setValue // Poner valores en el formulario
    } = useForm();

    const navigate = useNavigate();
    const params = useParams()

    useEffect(() => {
        async function load(){
            if (params.id){
                const data = await getPromoter(params.id)
                const {
                    data: { code, name, paternal_surname, maternal_surname, phone, email, notes}
                } = await getPromoter(params.id)
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

    const handleBack = () => {
        navigate(-1); // Esto regresa una página en el historial
    };


    const onSubmit = handleSubmit( async (data) => {
        if (params.id) {
            await updatePromoter(params.id, data)
            console.log(data)
            toast.success('updated success', {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff",
                },
            })
        } else {
            await createPromoter(data);
            toast.success('created success', {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff",
                },
            })
        }
    
        navigate("/dashboard/promotores")
    })
    
    

    return(
        <div>
            <Toaster />
    
            <form onSubmit={onSubmit} >
    
                <div className="form-rectangulo-head">
                    <div className="title-button-wrapper"> 
                        <div className="title-section">
                            <div className="title-row">
                                <h1> Promotor </h1> 
                                <h2> {params.id ? 'Editar ' : 'Nuevo '} </h2>
                            </div>
                            <p className="subtitle">Registro de promotor</p  >
                        </div>
                        
                        <div className="button-section">
                            <button  onClick={handleBack} type="button"  className="btn-secondary"> 
                                regresar 
                            </button> 

                            <button type="submit"  className="btn-primary"> 
                                {params.id ? 'Actualizar' : 'Guardar'} 
                            </button>
                        </div> 
                    </div>
                </div>

                
                <div className="form-rectangulo">
                    <div className="form-row row-4 ">
                        <div className="form-group">
                            <label>Codigo:</label>
                            <input 
                                type="text" 
                                placeholder="Generado Automaticamente" 
                                {...register("code", {required: false})}
                                disabled
                                //className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 "
                                autoFocus
                                
                            />
                            {errors.code && <span>this field is required</span>}
                        </div>
                  

                   
                        <div className="form-group">
                            <label>Nombre</label>
                            <input 
                                type="text" 
                                placeholder="Nombre"
                                {...register("name", {required: true})} 
                                //style={{width : '200px'}}
                            />

                            {errors.code && <span>this field is required</span>}

                        </div>
                        <div className="form-group">
                            <label>Apellido Paterno</label>
                            <input 
                                type="text" 
                                placeholder="Apellido Paterno" 
                                {...register("paternal_surname", {required: false})}
                                //style={{width : '200px'}}
                            />
                            {errors.paternal && <span>this field is required</span>}
                        </div>
                        <div className="form-group">
                            <label>Apellido Materno</label>
                            <input 
                                type="text" 
                                placeholder="Apellido Materno" 
                                {...register("maternal_surname", {required: false})}
                                //style={{width : '200px'}}
                            />
                            {errors.maternal && <span>this field is required</span>}
                        </div>
                    </div>

                    <div className="form-row row-4">
                        <div className="form-group">
                            <label>Email</label>
                            <input 
                                type="text" 
                                placeholder="Email" 
                                {...register("email", {required: false})}
                                //style={{width : '200px'}}
                            />
                        </div>
                        <div className="form-group">
                            <label>Telefono</label>
                            <input 
                                type="text" 
                                placeholder="Telefono" 
                                {...register("phone", {required: false})}
                                //style={{width : '200px'}}
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