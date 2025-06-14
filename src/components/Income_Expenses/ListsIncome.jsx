import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom"
import { useTable, useSortBy, usePagination, useFilters, useGlobalFilter } from 'react-table';

import { getAllIncome } from '../../api/income_expenses.api'; 

export function IncomeList() {
  // Estados
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const res = await getAllIncome();
      setData(res.data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Filtro global personalizado
  function fuzzyTextFilterFn(rows, id, filterValue) {
    return rows.filter((row) => {
      return Object.values(row.values).some((value) =>
        String(value).toLowerCase().includes(filterValue.toLowerCase())
      );
    });
  }

  // Definir columnas
  const columns = useMemo(() => [
    { Header: 'ID', accessor: 'id', Filter: DefaultColumnFilter },
    { Header: 'Status', accessor: 'status', Filter: DefaultColumnFilter },
    { Header: 'Fecha', accessor: 'date', Filter: DefaultColumnFilter },
    { Header: 'Concepto', accessor: 'concept', Filter: DefaultColumnFilter },
    { Header: 'Folio', accessor: 'folio', Filter: DefaultColumnFilter },
    { Header: 'Moneda', accessor: 'currency', Filter: DefaultColumnFilter },
    { Header: 'Importe', accessor: 'amount', Filter: DefaultColumnFilter },
  ], []);

  // Tabla
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
    state: { pageIndex, pageSize },
    setGlobalFilter
  } = useTable(
    {
      columns,
      data,
      globalFilter: fuzzyTextFilterFn,
      initialState: { pageIndex: 0, pageSize: 10 },
      autoResetGlobalFilter: false
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // Actualizar filtro global cuando cambia searchInput
  useEffect(() => {
    setGlobalFilter(searchInput);
  }, [searchInput, setGlobalFilter]);

  // Render de input por columna
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

  	const handleClick = () => {
        navigate('income');
    };

  // Doble clic para navegar
  const handleDoubleClick = (row) => {
    navigate(`/dashboard/broker/${row.original.id}`);
  };

  if (loading) return <div className="loading">Cargando datos...</div>;

  return (
    <div className="container">
		
      
		<div className="formulario-rectangulo--movements-flotante">
			<h3> Ingresos </h3>
			<button onClick={handleClick}>
						Nuevo
			</button>
			
		</div>

		<div className="formulario-rectangulo">
      {/* Input de búsqueda global */}
      <input
        type="text"
        placeholder="Buscar en toda la tabla..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="search-input"
      />

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
          {[10, 20, 50].map(size => (
            <option key={size} value={size}>Mostrar {size}</option>
          ))}
        </select>
      </div>
    </div>
	</div>
	
  );
}

