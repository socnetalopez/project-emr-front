import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";

import TableComponent from "../../components/TableComponent";
import { getAllComisionistas } from '../../services/commission_agents.api';

const ComAgentsLists = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllComisionistas();
        const comagents = Array.isArray(response.data) ? response.data : [];
        setData(comagents);
      } catch (error) {
        console.error("Error fetching:", error);
        setData([]);
      }
    };
    fetchData();
  }, []);

  const columns = useMemo(() => [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Nombre', accessor: 'name' },
    { Header: 'Apellido Paterno', accessor: 'paternal_surname' },
    { Header: 'Apellido Materno', accessor: 'maternal_surname' },
    {
      Header: 'Estatus',
      accessor: 'status',
      Cell: ({ value }) => (
        <span className={value === 1 ? 'status-activo' : 'status-inactivo'}>
          {value === 1 ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
  ], []);

  const handleRowDoubleClick = (row) => {
    navigate(`/dashboard/comisionista/${row.original.id}`);
  };

  const handleAddNew = () => {
    navigate('/dashboard/comisionista');
  };

  return (
    <div>
      <TableComponent
        title="Comisionistas "
    	subtitle="Listado de comisionistas"
        columns={columns}
        data={Array.isArray(data) ? data : []}
        onRowDoubleClick={handleRowDoubleClick}
        onAdd={handleAddNew}
      />
    </div>
  );
};

export default ComAgentsLists;
