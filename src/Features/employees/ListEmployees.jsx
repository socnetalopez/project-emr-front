import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import TableComponent from "../../components/TableComponent";
import { getEmployees } from "../../services/employees.api";

const EmployeesList = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEmployees();

        // Verificar que response.data sea un array
        const employees = Array.isArray(response.data) ? response.data : [];
        setData(employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
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
    navigate(`/dashboard/employee/${row.original.id}`);
  };

  const handleAddNew = () => {
    navigate('/dashboard/employee');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ marginBottom: '1rem', fontSize: "20px", fontWeight: "bold" }}>
        Empleados
      </h2>

      <TableComponent
        columns={columns}
        data={Array.isArray(data) ? data : []}
        onRowDoubleClick={handleRowDoubleClick}
        onAdd={handleAddNew}
      />
    </div>
  );
};

export default EmployeesList;
