import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom"
//import React, {  useMemo } from 'react';
import { useTable, useSortBy, usePagination, useFilters, useGlobalFilter } from 'react-table';
import { getAllPromoters } from "../../api/catalogos.api";


const PromoterLists = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState("");
    const [selectedRow, setSelectedRow] = useState(null);
    const [searchInput, setSearchInput] = useState("");

    const [Promoters, setPromoters] = useState("");
    

    useEffect(() => {
        async function loadCombos(){  
            const PromoterResponse = await getAllPromoters();
            
            setData(PromoterResponse.data)
            //setLoading(false)
            }
            loadCombos();
        }, [])

    
    // Filtrado de búsqueda
        const filteredData = React.useMemo(() => {
            return data.filter((row) =>
                Object.values(row).some((value) =>
                    String(value).toLowerCase().includes(searchInput.toLowerCase())
                )
            );
        }, [data, searchInput]);
    
    
        // Definir columnas
        const columns = useMemo(() => [
            { Header: 'ID', accessor: 'id', Filter: DefaultColumnFilter, width:10 },
            { Header: 'Status', 
            	accessor: 'status', 
				      Filter: DefaultColumnFilter,
				      Cell: ({ value }) => {
                if (value === 1) {
                  return (
                    <span className="status-label status-activo">
                      Activo
                    </span>
                  );
                } else if (value === 2) {
                  return (
                    <span className="status-label status-inactivo">
                      Inactivo
                    </span>
                  );
                } else {
                  return value;
                }
              }
            },
            { Header: 'Codigo', accessor: 'code', Filter: DefaultColumnFilter },
            { Header: 'Nombre', accessor: 'name', Filter: DefaultColumnFilter },
            { Header: 'Apellido Paterno', accessor: 'paternal_surname', Filter: DefaultColumnFilter },
            { Header: 'Apellido Materno', accessor: 'maternal_surname', Filter: DefaultColumnFilter },
    
        ], []);
    
        // Configuración de la tabla con react-table
        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            page,
            prepareRow,
            canPreviousPage,
            canNextPage,
            pageOptions,
            pageCount,
            gotoPage,
            nextPage,
            previousPage,
            setPageSize,
            state: { pageIndex, pageSize, globalFilter },
            setGlobalFilter,
        } = useTable(
            {
                columns,
                data,
                initialState: { pageIndex: 0, pageSize: 10 },
            },
            useFilters,
            useGlobalFilter,
            useSortBy,
            usePagination
        );
    
        // Filtro por columna
        function DefaultColumnFilter({ column: { filterValue, setFilter } }) {
            return (
                <input
                    value={filterValue || ''}
                    onChange={e => setFilter(e.target.value || undefined)}
                    placeholder="Filtrar..."
                    className="column-filter"
                />
            );
        }
    
        // Búsqueda global
        const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
            return (
                <input
                    value={globalFilter || ''}
                    onChange={e => setGlobalFilter(e.target.value || '' )}
                    placeholder="Buscar en toda la tabla..."
                    className="global-filter"
                />
            );
        };
    
        // Manejar doble clic
        const navigate = useNavigate()
        const handleDoubleClick = (row) => {
            //setSelectedRow(row.original);
            navigate(`/dashboard/promotordetail/${row.original.id}`)
        };
    
        if (loading) return <div className="loading">Cargando datos...</div>;

    

    return(
        <div className="container">
            
            <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
          <table {...getTableProps()} className="data-table">
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
                      <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                      <div>{column.canFilter ? column.render('Filter') : null}</div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map(row => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    onDoubleClick={() => handleDoubleClick(row)}
                    className="table-row"
                  >
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Controles de paginación */}
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>{'<'}</button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>{'>'}</button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button>
        <span>
          Página <strong>{pageIndex + 1} de {pageOptions.length}</strong>
        </span>
        <select
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
        >
          {[10, 25, 50, 100].map(size => (
            <option key={size} value={size}>Mostrar {size}</option>
          ))}
        </select>
      </div>

    </div>
  );
    

}

export default PromoterLists 