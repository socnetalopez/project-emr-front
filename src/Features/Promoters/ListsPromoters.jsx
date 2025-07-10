import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";

import TableComponent from "../../components/TableComponent";
import { getAllPromoters } from '../../services/promoters.api';

const PromotersList = () => {
	const [data, setData] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
		try {
			const response = await getAllPromoters();
			const brokers = Array.isArray(response.data) ? response.data : [];
			setData(brokers);
		} catch (error) {
			console.error("Error fetching:", error);
			setData([]);
		}
		};
		fetchData();
	}, []);

	const columns = useMemo(() => [
		{ Header: 'ID', accessor: 'id' },
		
		{
			Header: 'Estatus',
			accessor: 'status',
			Cell: ({ value }) => (
				<span className={value === 1 ? 'status-activo' : 'status-inactivo'}>
				{value === 1 ? 'Activo' : 'Inactivo'}
				</span>
			)
		},
		
		{ Header: 'Codigo', accessor: 'code' },
		{ Header: 'Nombre', accessor: 'name' },
		{ Header: 'Apellido Paterno', accessor: 'paternal_surname' },
		{ Header: 'Apellido Materno', accessor: 'maternal_surname' },
		{ Header: 'Telefono', accessor: 'phone' },
		{ Header: 'Email', accessor: 'email' },
		
	], []);


	const handleRowDoubleClick = (row) => {
		navigate(`/dashboard/promotordetail/${row.original.id}`)
	};

	const handleAddNew = () => {
		navigate('/dashboard/promotor');
	};



	return (
		<div>
			<TableComponent
				title="Promotores | "
				subtitle="Listado de promotores"
				columns={columns}
				data={Array.isArray(data) ? data : []}
				onRowDoubleClick={handleRowDoubleClick}
				onAdd={handleAddNew}
			/>
		</div>
	);
};

export default  PromotersList;
