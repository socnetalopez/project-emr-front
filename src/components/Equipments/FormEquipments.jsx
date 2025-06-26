
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

import { getAllMake, getAllModel, getAllEquipmentType, getAllStatus, getAllBranches, CreateEquipment, getEquipmentDetail, updateEquipment } from "../../api/equipments.api";

import '../CSS/FormGeneral.css';


export function EquipmentsFormPage() {

    const {
        register,
        handleSubmit, 
        formState: { errors },
        setValue // Poner valores en el formulario
    } = useForm();

	const [formData, setFormData] = useState({});

	const [make_List, setMake_List] = useState([]);
	const [model_List, setModel_List] = useState([]);
	const [equipmentType_List, setEquipmentType_List] = useState([]);
	const [branch_List, setBranch_List] = useState([]);
	const [status_List, setStatus_List] = useState([]);

    const navigate = useNavigate();
    const params = useParams()

	useEffect(() => {
		const fetchData = async () => {
			try {
				const makeResponse = await getAllMake();
				const modelResponse = await getAllModel();
				const eqtypeResponse = await getAllEquipmentType();
				const branchesResponse = await getAllBranches();
				const statusResponse = await getAllStatus();

				setMake_List(makeResponse.data);
				setModel_List(modelResponse.data);
				setEquipmentType_List(eqtypeResponse.data);
				setBranch_List(branchesResponse.data);
				setStatus_List(statusResponse.data);

			} catch (error) {
				console.error("Error al cargar los datos", error);
				//setLoading(false);
			}
		};
		
		fetchData();
	}, []);

	useEffect(() => {
			async function loadforUpdate(){
			//const loadRequest = async () => {
				if (params.id){
					try {
						const res  = await getEquipmentDetail(params.id);
						const data = res.data
						const data1 = String(data.type_request);
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

		setFormData((prevData) => ({
		...prevData,
		[name]:value,
		}));
  	};
	

    const handleSave =  async () => {
		console.log("Guardando..", formData.make)
        if (params.id) {
            await updateEquipment(params.id, formData)
            console.log("Update",formData)
            toast.success('updated success', {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff",
                },
            })
        } else {
			console.log("saved:", formData);
            await CreateEquipment(formData);
            toast.success('created success', {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff",
                },
            })
        }
    
        navigate("/dashboard/equipments/equipments")
    }


    return(
		<>
      <Toaster position="bottom-right" reverseOrder={false} />
      {/* Tus rutas y demás componentes */}
    
		
        <div className="container">
			
            <div className="formulario-rectangulo--movements-flotante">
                
                <h1>
                    {params.id ? 'Editar' : 'Nuevo'} Equipment 
                </h1>
                
                <button
					onClick={handleSave}
				> 
                    {params.id ? 'Actualizar' : 'Guardar'} 
                </button>
                
            </div>

            

            <div className="form-rectangulo"> 
                    
				<div className="form-row row-5">
					<div className="form-group">
						<label>Nombre</label>
						<input
							name = "name"
							type="text" 
							value={formData.name}
							onChange={handleChange}
							style={{width : '200px'}}
						/>

						{errors.code && <span>this field is required</span>}
					</div>

					<div className="form-group">
						<label>Type:</label>
						<select
							name="equipment_type"
							value={formData.equipment_type}
							onChange={handleChange}
						>
							<option value="">Selecciona</option>
							{equipmentType_List.map((et) => (
							<option key={et.id} value={et.id}>
								{et.name} 
							</option>
							))}
						</select>
					</div>

					<div className="form-group">
						<label>Make:</label>
						<select
							name="make"
							className="select-field"
							value={formData.make}
							onChange={handleChange}
						>
							<option value="">Selecciona</option>
							{make_List.map((m) => (
							<option key={m.id} value={m.id}>
								{m.name} 
							</option>
							))}
						</select>
					</div>

					<div className="form-group">
						<label>Model:</label>
						<select
							name="model"
							className="select-field"
							value={formData.model}
							onChange={handleChange}
						>
							<option value="">Selecciona</option>
							{model_List.map((itl) => (
							<option key={itl.id} value={itl.id}>
								{itl.name} 
							</option>
							))}
						</select>
					</div>


					<div className="form-group">
						<label>Serial Number</label>
						<input 
							type="text" 
							name="serialnumber"
							value={formData.serialnumber}
							onChange={handleChange}
							style={{width : '200px'}}
						/>
						{errors.serialnumber && <span>this field is required</span>}
					</div>

					<div className="form-group">
						<label>Status:</label>
						<select
							name="status"
							className="select-field"
							value={formData.status}
							onChange={handleChange}
						>
							<option value="">Selecciona</option>
							{status_List.map((itl) => (
							<option key={itl.id} value={itl.id}>
								{itl.name} 
							</option>
							))}
						</select>
					</div>

					<div className="form-group">
						<label>Ubicacion:</label>
						<select
							name="branch"
							className="select-field"
							value={formData.branch}
							onChange={handleChange}
						>
							<option value="">Selecciona</option>
							{branch_List.map((brc) => (
							<option key={brc.id} value={brc.id}>
								{brc.name} 
							</option>
							))}
						</select>
					</div>

					<div className="form-group">
						<label>Asigned to:</label>
						<input 
							name = "asigned_to"
							type="text"
							value={formData.asigned_to}
							onChange={handleChange}
							style={{width : '200px'}}
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
		</>
	
    )

}