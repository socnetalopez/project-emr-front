import React from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useFilters,
  useGlobalFilter,
} from "react-table";

import "./css/TableComponent.css";

function DefaultColumnFilter({ column: { filterValue, setFilter } }) {
  return (
    <input
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value || undefined)}
      placeholder="Filtrar..."
      className="column-filter"
    />
  );
}

function GlobalFilter({ globalFilter, setGlobalFilter }) {
  return (
    <input
      value={globalFilter || ""}
      onChange={(e) => setGlobalFilter(e.target.value || "")}
      placeholder="Buscar en toda la tabla..."
      className="global-filter"
    />
  );
}

const TableComponent = ({ columns, data, onRowDoubleClick, title, subtitle, onAdd }) => {
  if (!Array.isArray(columns) || !Array.isArray(data)) {
    return (
      <div style={{ color: "red", padding: "1rem" }}>
        Error: columnas o datos inválidos.
      </div>
    );
  }

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
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <>
      
      <div className="form-rectangulo-head">
        <div className="table-header-left">
        {title && <h2 className="table-title">{title}</h2>}
         {subtitle && <p className="table-subtitle">{subtitle}</p>}
        </div>
        <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        {onAdd && (
          <button className="btn-nuevo" onClick={onAdd}>
            Nuevo
          </button>
        )}
      </div>

      <div className="form-rectangulo">
        <table {...getTableProps()} className="data-table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={column.id}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center", padding: "1rem" }}>
                  No hay datos que mostrar.
                </td>
              </tr>
            ) : (
              page.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    key={row.id}
                    onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(row)}
                  >
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} key={cell.column.id}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div className="pagination">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button>
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {">>"}
          </button>
          <span>
            Página <strong>{pageIndex + 1} de {pageOptions.length}</strong>
          </span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                Mostrar {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default TableComponent;
