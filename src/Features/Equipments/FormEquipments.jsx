
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";


import { 	getMake, 
			createMake, 
			getModel, 
			createModel, 
			getEquipmentType, 
			createEquipmentType,
			getProcessors,
			createProcessor,
			getRam,
			createRam,
			getDisks,
			createDisks,
			getIpAddress,
			createIpAddress,
			createEquipments,
			getEquipmentId,
			updateEquipments
		} from "../../services/equipments.api ";


import { getBranchs, getStatus } from "../../services/components.api ";
import { getEmployeesOnlyFullname } from "../../services/employees.api";

import InputWithValidation from "../../components/InputWithValidation";
import ApiSelect from "../../components/CustomSelect";


import '../../components/css/FormComponent.css';



export function EquipmentsFormPage() {

	const {
		register,
		formState: { errors },
		setValue // Poner valores en el formulario
	} = useForm();

	const [formData, setFormData] = useState({
		name : '',
		serialnumber : ''
	});
	const [status_List, setStatus_List] = useState([]);
	const [error, setError] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const [fetchEmployees, setFetchEmployees] = useState([]);
	const [fetchMake, setFetchMake] = useState()
	const [fetchModel, setFetchModel] = useState({});
	const [fetchProcessor, setFetchProcessor] = useState({});
	const [fetchRam, setFetchRam] = useState({});
	const [fetchDisks, setFetchDisks] = useState({});
	const [fetchIP, setFetchIP] = useState({});
	const [fetchEquipmenttype, setFetchEquipmenttype] = useState({})
	const [fetchStatus, setFetchStatus] = useState({})
	const [fetchBranchs, setFetchBranchs] = useState([]);

	
    const navigate = useNavigate();
    const params = useParams()

	// Obtener los datos de la API
	
	const fetchCombos = async () => {
		try {
			const makeResponse = await getMake();
			const modelResponse = await getModel();
			const processorResponse = await getProcessors();
			const ramResponse = await getRam();
			const diskResponse = await getDisks();
			const ipResponse = await getIpAddress();
			const eqtypeResponse = await getEquipmentType();
			const statusResponse = await getStatus();
			const branchsResponse = await getBranchs();
			const employeesResponse = await getEmployeesOnlyFullname();
			
			setFetchEmployees(employeesResponse.data);
			setFetchMake(makeResponse.data);
			setFetchModel(modelResponse.data);
			setFetchProcessor(processorResponse.data);
			setFetchRam(ramResponse.data);
			setFetchDisks(diskResponse.data);
			setFetchIP(ipResponse.data);
			setFetchEquipmenttype(eqtypeResponse.data);
			setFetchStatus(statusResponse.data);
			setFetchBranchs(branchsResponse.data);
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
			if (params.id){
				try {
					const res  = await getEquipmentId(params.id);
					const data = res.data
					setFormData(data);
					console.log(data)
										
				} catch (error) {
					console.error("Error loading request:", error);
				}    
			} 
		}
		loadforUpdate()
	}, [params.id]);


	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]:value,
		}));
  	};
	

	 const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

		e.preventDefault();
        setSubmitted(true);

        if (formData.name.trim() === "" || !formData.equipment_type) {
            setError(true);
            return;
        }

        setError(false);

		const data = {
					name: formData.name,
					make: formData.make,
					model: formData.model,
					equipment_type: formData.equipment_type,
					processor: formData.processor,
					ram: formData.ram,
					disk: formData.disk,
					serialnumber: formData.serialnumber,
					employee: formData.employee,
					status: formData.status,
					branch: formData.branch,
					ipaddress: formData.ipaddress,
					notes: formData.notes,

				}
		
				if (params.id) {
						console.log(params.id,"update:",data)
						await updateEquipments(params.id, data)
						toast.success('Cliente updated success', {
							position: "bottom-right",
							style: {
								background: "#101010",
								color: "#fff",
							},
						})
					} else {
						console.log("create:",data)
						await createEquipments(data);
						toast.success('Cliente created success', {
							position: "bottom-right",
							style: {
								background: "#101010",
								color: "#fff",
							},
						})
					}
		
					navigate("/dashboard/equipments/equipments");
    
    
    };



    return(

		<>
		<Toaster position="bottom-right" reverseOrder={false} />
		{/* Tus rutas y demás componentes */}
		
			
			<div className="">
			
            <div className="form-rectangulo ">
                
                <h1>
                    EQUIPOS DE COMPUTO {params.id ? 'Editar' : 'Nuevo'}
                </h1>
                
                <button
					onClick={handleSubmit}
				> 
                    {params.id ? 'Actualizar' : 'Guardar'} 
                </button>
                
            </div>


            <div className="form-rectangulo"> 
                    
				<div className="form-row row-5">
					<div className="form-group">
                         <InputWithValidation
                            label="Nombre"
                            name="name"
                            placeholder="Ingresa tu nombre"
                            value={formData.name}
                            onChange={handleChange}
                            showError={submitted && formData.name.trim() === ""} 
                        />
                    </div>

					<div className="form-group">
						<label>Tipo:</label>
						<ApiSelect
								optionsData={fetchEquipmenttype}
								value={formData.equipment_type}
								onChange={value => setFormData({ ...formData, equipment_type: value })}
								isInvalid={error}
								errorMessage="Debes seleccionar una opción"
								onCreate={createEquipmentType}
								refreshOptions={fetchCombos}
								
							/>
					</div>

				
					<div className="form-group">
						<label>Marca:</label>
						<ApiSelect
							optionsData={fetchMake}
							value={formData.make}
							onChange={(value) => setFormData({ ...formData, make: value })}
							isInvalid={error}
							errorMessage="Debes seleccionar una opción"
							//apiUrl = "createMake"  // <-- aquí tu endpoint POST
							onCreate={createMake}
							refreshOptions={fetchCombos}
							 //errorMessage={fieldErrors.model?.non_field_errors?.[0]}
							//refreshOptions={miFuncionParaRecargarOpciones} // <-- volver a cargar tras guardar
							/>
						</div>

					<div className="form-group">
						<label>Modelo:</label>
						<ApiSelect
                            optionsData={fetchModel}
                            value={formData.model}
                            onChange={(value) => setFormData({ ...formData, model: value })}
                            isInvalid={error}
                            errorMessage="Debes seleccionar una opción"
							onCreate={createModel}
							refreshOptions={fetchCombos}
                            
                        />
					</div>


					<div className="form-group">
						<InputWithValidation 
                            label="Numero de Serie"
                            name="serialnumber"
                            placeholder="Ingresa el numero de serie"
                            value={formData.serialnumber}
                            onChange={handleChange}
                            showError={submitted && (formData.serialnumber || "").trim() === ""} 
                            //style={{width : '200px'}}
                        />
					</div>

					<div className="form-group">
						<label>Status:</label>
						<ApiSelect
                            optionsData={fetchStatus}
                            value={formData.status}
                            onChange={value => setFormData({ ...formData, status: value })}
                            isInvalid={error}
                            errorMessage="Debes seleccionar una opción"
                        />
					</div>

					<div className="form-group">
						<label>Ubicacion:</label>
						<ApiSelect
                            optionsData={fetchBranchs}
                            value={formData.branch}
                            onChange={value => setFormData({ ...formData, branch: value })}
                            isInvalid={error}
                            errorMessage="Debes seleccionar una opción"
                            
                        />
					</div>

					<div className="form-group">
						<label>IP Address:</label>
						<ApiSelect
                            optionsData={fetchIP}
                            value={formData.ipaddress}
                            onChange={(value) => setFormData({ ...formData, ipaddress: value })}
                            //isInvalid={error}
                            //errorMessage="Debes seleccionar una opción"
							onCreate={createIpAddress}
							refreshOptions={fetchCombos}
                            
                        />
					</div>

					<div className="form-group">
						<label>Asignado a:</label>
						<ApiSelect
                            optionsData={fetchEmployees}
                            value={formData.employee}
                            onChange={value => setFormData({ ...formData, employee: value })}
                            isInvalid={error}
                            errorMessage="Debes seleccionar una opción"  
                        />
						
					</div>

                </div>
                                        
					<div className="form-group textarea-full">
						<label>Observaciones</label>
						<textarea
							name="notes"
							value={formData.notes}
							onChange={handleChange}
							rows="3" 
							placeholder="Observaciones"
						></textarea>
					
					</div>
				</div>
        </div>

		<div className="form-rectangulo">
			<h1>Hardware</h1>
			<div className="form-row row-4">
				<div className="form-group">
					<label>Procesador:</label>
					<ApiSelect
						optionsData={fetchProcessor}
						value={formData.processor}
						onChange={value => setFormData({ ...formData, processor: value })}
						isInvalid={error}
						errorMessage="Debes seleccionar una opción" 
						onCreate={createProcessor}
						refreshOptions={fetchCombos}
					/>		
				</div>

				<div className="form-group">
					<label>Memoria Ram:</label>
					<ApiSelect
						optionsData={fetchRam}
						value={formData.ram}
						onChange={value => setFormData({ ...formData, ram: value })}
						isInvalid={error}
						errorMessage="Debes seleccionar una opción"  
						onCreate={createRam}
						refreshOptions={fetchCombos}
					/>		
				</div>

				<div className="form-group">
					<label>Disco Duro:</label>
					<ApiSelect
						optionsData={fetchDisks}
						value={formData.disk}
						onChange={value => setFormData({ ...formData, disk: value })}
						isInvalid={error}
						errorMessage="Debes seleccionar una opción"  
						onCreate={createDisks}
						refreshOptions={fetchCombos}
					/>		
				</div>

			</div>
		</div>
		</>
	
    )

}