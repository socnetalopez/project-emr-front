// Lista comisiones de Promotores

import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast";

//import React, {  useMemo } from 'react';
import { useTable, useSortBy, usePagination, useFilters, useGlobalFilter } from 'react-table';
import { getAllPromoters, getComisionVenta, updateComisionVenta } from "../../api/catalogos.api";
import FormularioComision from "./FormComisionVenta";

import '../CSS/Comisiones.css'; // Estilos que definiremos después

const ComisionVentaLists = ({ promotorId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState("");
    const [selectedRow, setSelectedRow] = useState(null);
    const [searchInput, setSearchInput] = useState("");

    const [Promoters, setPromoters] = useState("");
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const params = useParams()
 
    
    useEffect(() => {
        async function loadCombos(){  
            const PromoterResponse = await getComisionVenta(promotorId);
            
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
            { Header: 'ID', accessor: 'id', Filter: DefaultColumnFilter, width: '50px' },
            { Header: 'Codigo', accessor: 'code', Filter: DefaultColumnFilter, width: '60px' },
            { Header: 'Nombre', accessor: 'name', Filter: DefaultColumnFilter },
            { Header: 'Tipo', accessor: 'tipo.name', Filter: DefaultColumnFilter, width: '60px' },
            { Header: 'Base', accessor: 'base.name', Filter: DefaultColumnFilter, width: '60px' },
            { Header: 'Venta', accessor: 'percentage_sales', Filter: DefaultColumnFilter, width: '60px' },
            { Header: 'Costo', accessor: 'percentage_cost', Filter: DefaultColumnFilter, width: '60px' },
            { Header: 'Casa', accessor: 'percentage_house', Filter: DefaultColumnFilter, width: '60px' },
            { Header: 'Comision', accessor: 'percentage_commission', Filter: DefaultColumnFilter, width: '60px' },
    
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
        const [comisionSeleccionada, setComisionSeleccionada] = useState(null);
        const [comisiones, setComisiones] = useState([]);
        const handleDoubleClick = (row) => {
            //navigate(`/promotor/${row.original.id}`)
            setMostrarFormulario(row.original.id);
        };

        
        const handleGuardar = async (nuevaDescripcion) => {
          console.log("param",params.id,"-data-", nuevaDescripcion )
          if (nuevaDescripcion.id) {
            console.log("update:",nuevaDescripcion)
            await updateComisionVenta(nuevaDescripcion.id, nuevaDescripcion)
            setMostrarFormulario(false);
            toast.success('Cliente updated success', {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff",
                },
            })
          } else {
            //await createCustomer(data);
            toast.success('Cliente created success', {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff",
                },
            })
          }


          
          navigate(`/dashboard/promotordetail/${params.id}/`)

        }


    
        if (loading) return <div className="loading">Cargando datos...</div>;

    

    return(
        <div>
            { /*<GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} /> */}
          
          <table {...getTableProps()} className="data-table">
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}
                     style={{width: column.width, maxWidth: column.width, minWidth: column.width }}
                    >
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
                      <td {...cell.getCellProps()} 
                          style={{ width: cell.column.width, maxWidth: cell.column.width, minWidth: cell.column.width }} >
                        {cell.render('Cell')}
                      </td>
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
          {[5, 10, 20].map(size => (
            <option key={size} value={size}>Mostrar {size}</option>
          ))}
        </select>
      </div>
      
      {mostrarFormulario && (
        <FormularioComision
          comision={comisionSeleccionada}
          promotorId={promotorId}
          comisionventaId={mostrarFormulario}
          onGuardar={handleGuardar}
          onCancelar={() => setMostrarFormulario(false)}
        />
      )}

    </div>
  );
    

}

export default ComisionVentaLists 