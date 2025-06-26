
import { useEffect } from "react";
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { getBroker, createBroker, updateBroker } from "../../api/catalogos.api";

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
                    data: { code, name, paternal_surname, maternal_surname, phone, email, notes}
                } = await getBroker(params.id)
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
        
       
            <div className="container">
    
                <form onSubmit={onSubmit} >
     
                <div className="form-rectangulo-head">
                    <div className="title-button-wrapper"> 
                        <h1>
                            {params.id ? 'Editar ' : 'Nuevo '} Broker 
                        </h1>
                        
                        <button type="submit"> 
                            {params.id ? 'Actualizar' : 'Guardar'} 
                        </button> 
                    </div>
                </div>

                
                <div className="form-rectangulo">
                    <div className="form-row row-3 ">
                        <div className="form-group-inline">
                            <label>Codigo:</label>
                            <input 
                                type="text" 
                                placeholder="code" 
                                {...register("code", {required: true})}
                                disabled
                                //className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 "
                                autoFocus
                                
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

                            {errors.code && <span>this field is required</span>}

                        </div>
                        <div className="form-group">
                            <label>Apellido Paterno</label>
                            <input 
                                type="text" 
                                placeholder="Apellido Paterno" 
                                {...register("paternal_surname", {required: false})}
                                style={{width : '200px'}}
                            />
                            {errors.paternal && <span>this field is required</span>}
                        </div>
                        <div className="form-group">
                            <label>Apellido Materno</label>
                            <input 
                                type="text" 
                                placeholder="Apellido Materno" 
                                {...register("maternal_surname", {required: false})}
                                style={{width : '200px'}}
                            />
                            {errors.maternal && <span>this field is required</span>}
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