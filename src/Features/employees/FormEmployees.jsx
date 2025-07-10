
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import { toast } from "react-hot-toast";

import { getEmployeeDetail, createEmployees, updateEmployee } from "../../services/employees.api";
import { getJobs, createJobs, 
            getDepatmentsName, createDepatmentsName,
            getGenders, getHighestLevelEducation } from "../../services/components.api ";

import "react-datepicker/dist/react-datepicker.css";
import '../../components/css/FormComponent.css'

import InputWithValidation from "../../components/InputWithValidation";
import ApiSelect from "../../components/CustomSelect";


export function EmployeesForm() {

    const {
        register,
        formState: { errors },
        setValue // Poner valores en el formulario
    } = useForm();

    const navigate = useNavigate();
    const params = useParams()

    const [formData, setFormData] = useState({ 
        name: "",
        paternal_surname:"",
        maternal_surname:"",
        email: "",
        phone: "",
        job:"",
        department: "",
        gender: "",
        curp: "",
        rfc: "",
        date: new Date() // Inicializa con la fecha actual
    });
    
    const [submitted, setSubmitted] = useState(false);
    const [fetchJobs, setFetchJobs] = useState({});
    const [fetchDepartmentName, setFetchDepartmentName] = useState({});
    const [fetchGender, setFetchGender] = useState({});
    const [fetchHighestLevelEducation, setFetchHighestLevelEducation] = useState({});
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
     const [error, setError] = useState(false);

    // Obtener los datos de la API
    
        const fetchCombos = async () => {
            try {
                const jobsResponse = await getJobs();
                const depanameResponse = await getDepatmentsName();
                const genderResponse = await getGenders();
                const hleducationresponse = await getHighestLevelEducation();
                //const countryResponse = await getCountry();
                //const statesResponse = await getStates();
                //const municipiosResponse = await getMunicpio();

                
                setFetchJobs(jobsResponse.data);
                setFetchDepartmentName(depanameResponse.data);
                setFetchGender(genderResponse.data);
                setFetchHighestLevelEducation(hleducationresponse.data);
                //setCountry_All(countryResponse.data);
                //setStates_All(statesResponse.data);
                //setMunicipios_All(municipiosResponse.data);
            } catch (error) {
                console.error("Error al cargar los datos", error);
                //setLoading(false);
            }
        };
    
    useEffect(() => {
    
        fetchCombos();

    }, []);

   
    useEffect(() => {
        async function loadforUpdate(){
        //const loadRequest = async () => {
            if (params.id){
                try {
                    const res  = await getEmployeeDetail(params.id);
                    const data = res.data
                    setFormData(data);
                    console.log("data:",data)
                    
                } catch (error) {
                    console.error("Error loading:", error);
                }    

            } 
            
        }
        loadforUpdate()
    }, [params.id]);

 
    const handleBack = () => {
        navigate(-1);
    };


    const handleChange = (e, nameFromSelect = null) => {
        if (e?.target) {
            // Cambio de input estándar
            setFormData({ ...formData, [e.target.name]: e.target.value });
        } else if (nameFromSelect) {
            // Cambio desde un Select personalizado
            setFormData({ ...formData, [nameFromSelect]: e.value });
        }
        console.log(formData)
        };
    
    const handleDateChange = (date) => {
        const formattedD = date ? date.toISOString().split("T")[0] : ''; // Formats to YYYY-MM-DD
         //setRequest(prev => ({ 
        //        ...prev,
        //            date: formattedD
        //    }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (formData.name.trim() === "" || !formData.job || !formData.department) {
            setError(true);
            return;
        }


        setError(false);
        // Continuar con el submit
        

        const data = {
            name: formData.name,
            paternal_surname: formData.paternal_surname,
            maternal_surname: formData.maternal_surname,
            email: formData.email,
            phone: formData.phone,
            job: formData.job,
            department: formData.department,
            hleducation: formData.job,
            date: formData.date //? formData.date.toISOString().split("T")[0] : '', // Formats to YYYY-MM-DD
        }

        if (params.id) {
                console.log(params.id,"update:",data)
                await updateEmployee(params.id, data)
                toast.success('Cliente updated success', {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff",
                    },
                })
            } else {
                console.log("create:",data)
                await createEmployees(data);
                toast.success('Cliente created success', {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff",
                    },
                })
            }

             navigate("/dashboard/employees")
            //alert('Formulario enviado con éxito');
    
    };


    return(
        
        <div className="container">
            <form onSubmit={handleSubmit} style={{  margin: "2rem auto" }}>

                <div className="form-rectangulo-head">
                    <div className="title-button-wrapper"> 
                        <h1>
                            Empleado {params.id ? 'Editar ' : 'Nuevo '}
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
                       
                        <InputWithValidation
                            label="Num Empleado"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            //showError={submitted && formData.code.trim() === ""} 
                            //style={{width : '400px'}}
                        />

                    </div>
                </div>
                )}

                <div className="form-row row-3">
                    <div className="form-group">
                         <InputWithValidation
                            label="Nombre"
                            name="name"
                            placeholder="Ingresa tu nombre"
                            value={formData.name}
                            onChange={handleChange}
                            showError={submitted && formData.name.trim() === ""} 
                            //style={{width : '800px'}}
                        />
                    </div>
                        
                    <div className="form-group">
                        <InputWithValidation 
                            label="Apellido Paterno"
                            name="paternal_surname"
                            placeholder="Ingresa tu nombre"
                            value={formData.paternal_surname}
                            onChange={handleChange}
                            showError={submitted && formData.paternal_surname.trim() === ""} 
                            //style={{width : '200px'}}
                        />
                    </div>
                    
                    <div className="form-group">
                        <InputWithValidation 
                            label="Apellido Materno"
                            name="maternal_surname"
                            placeholder="Ingresa tu nombre"
                            value={formData.maternal_surname}
                            onChange={handleChange}
                            showError={submitted && formData.maternal_surname.trim() === ""} 
                            //style={{width : '200px'}}
                        />
                    </div>
                </div>
                
                <div className="form-row row-3">
                    <div className="form-group">
                        <label>Email: </label>
                        <input
                            type="text"
                            name="email"
                            placeholder="Ingresa tu nombre"
                            value={formData.email}
                            onChange={handleChange}
                            //style={{ width: '200px' }}
                            />
                    </div>
                    
                    <div className="form-group">
                        <label >Puesto</label>
                        <ApiSelect
                            optionsData={fetchJobs}
                            value={formData.job}
                            onChange={value => setFormData({ ...formData, job: value })}
                            //isLoading={loading}
                            isInvalid={error}
                            errorMessage="Debes seleccionar una opción"
                            onCreate={createJobs}
                            refreshOptions={fetchCombos}
                        />
                                                    
                    </div>

                    <div className="form-group">
                        <label >Departamento</label>
                        
                        <ApiSelect
                            optionsData={fetchDepartmentName}
                            value={formData.department}
                            onChange={value => setFormData({ ...formData, department: value })}
                            isInvalid={error}
                            errorMessage="Debes seleccionar una opción"
                            onCreate={createDepatmentsName}
                            refreshOptions={fetchCombos}
                            
                        />
                                                    
                    </div>

                    <div className="form-group">
                        <label >Sexo</label>
                        
                        <ApiSelect
                            optionsData={fetchGender}
                            value={formData.gender}
                            onChange={value => setFormData({ ...formData, gender: value })}
                            //isInvalid={error}
                            //errorMessage="Debes seleccionar una opción"
                            
                        />                        
                    </div>

                    <div className="form-group">
                        <label>CURP</label>
                        <input
                            type="text"
                            name="curp"
                            placeholder="Ingresa tu nombre"
                            value={formData.curp}
                            onChange={handleChange}
                            //style={{ width: '200px' }}
                            />
                    </div>

                    <div className="form-group">
                        <label>RFC</label>
                        <input
                            type="text"
                            name="rfc"
                            placeholder="Ingresa el RFC"
                            value={formData.rfc}
                            onChange={handleChange}
                            //style={{ width: '200px' }}
                            />
                    </div>

                    <div className="campo-group">
                        <label>Fecha:</label>
                        <DatePicker
                            id="solicitud_date"
                            selected={formData.date}
                            onChange={handleDateChange}
                            dateFormat="dd-MM-yyyy"
                        />
                    </div>

                    <div className="form-group">
                        <label >Estudios</label>
                        <ApiSelect
                            optionsData={fetchHighestLevelEducation}
                            value={formData.hleducation}
                            onChange={value => setFormData({ ...formData, hleducation: value })}
                            //isInvalid={error}
                            //errorMessage="Debes seleccionar una opción"
                            
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