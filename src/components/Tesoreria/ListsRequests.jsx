import { Link, useNavigate, Outlet,  Routes, Route  } from "react-router-dom"
import { useEffect, useState } from "react";
import React, {  useMemo } from 'react';

import { useTable, useSortBy, usePagination, useFilters, useGlobalFilter } from 'react-table';
import { getAllRequests, getRequestsMain } from "../../api/solicitudes.api";
import '../CSS/DataTable.css';
import '../CSS/Layout.css';
import '../CSS/TreasuryMovements.css'

import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import { SolicitudFormPage } from "./SolicitudFormPage";



export function RequestsList() {
   

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize:10 });

    // Fetch data from API
    const fetchData = async () => {
        setLoading(true);
        try {
        const response = await getRequestsMain({
            params: {
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            },
        });
        setData(response.data); // Asumimos que la API devuelve un array de objetos
        } catch (error) {
        console.error('Error fetching data:', error);
        setData([]); // En caso de error, mostramos una tabla vacía
        }
        setLoading(false);
    };

    console.log(data)

    useEffect(() => {
        fetchData();
    }, [pagination.pageIndex, pagination.pageSize, search]);

    // Definición de columnas
    const columns = useMemo(
        () => [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: (info) => info.getValue() || '-', // Si es null o undefined, muestra '-'
        },
        {
            accessorKey: 'acciones',
            header: 'Acciones',
            cell: ({ row }) => (
                <div>
                   ...
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            //cell: (info) => info.getValue() || '-',
            cell: (info) => {
                const status = info.getValue();
                const statusMap = {
                    1: { label: 'Pendiente', colorClass: 'orange' },
                    2: { label: 'Ingreso', colorClass: 'blue' },
                    3: { label: 'Egreso Parcial', colorClass: 'green' },
                    4: { label: 'Egreso Total', colorClass: 'green' },
                };

                const statusData = statusMap[status] || { label: '-', colorClass: 'gray' };
                return (
                    <span className={`status-label ${statusData.colorClass}`}>
                        {statusData.label}
                    </span>
                );

            }
        
        },
        {
            accessorKey: 'folio',
            header: 'Folio',
            cell: (info) => info.getValue() || '-',
        },
        {
            accessorKey: 'date',
            header: 'Fecha',
            //cell: (info) => info.getValue() || '-',
            cell: (info) => {
        const rawDate = info.getValue();
        if (!rawDate) return '-';

        const date = new Date(rawDate);
        return date.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');;
    },
        },
        {
            accessorKey: 'type_request.name',
            header: 'Tipo',
            cell: (info) => info.getValue() || '-',
        },
        {
            accessorKey: 'type_payment.name',
            header: 'Pago',
            cell: (info) => info.getValue() || '-',
        },
        {
            accessorKey: 'promoter.fullname',
            header: 'Promotor',
            cell: (info) => info.getValue() || '-',
        },
        {
            accessorKey: 'clients',
            header: 'Cliente',
            //cell: (info) => info.getValue() || '-',
            cell: (info) => {
                const clients = info.getValue(); // array de clientes
                if (!clients || clients.length === 0) return '-';

                return (
                <ul style={{ paddingLeft: '1em', margin: 0 }}>
                    {clients.map((client, index) => (
                    <li key={index} style={{fontSize:'9px'}}>{client.customer_name}</li>
                    ))}
                </ul>
                );
            },
        },
        {
            accessorKey: '',
            header: '% Venta',
            cell: (info) => info.getValue() || '-',
        },
        {
            accessorKey: 'currency.type',
            header: 'Moneda',
            cell: (info) => info.getValue() || '-',
        },
        {
            accessorKey: 'pago',
            header: 'Pago Clientes',
            cell: (info) => info.getValue() || '-',
        },
        {
            accessorKey: 'retorno',
            header: 'Retorno',
            cell: (info) => info.getValue() || '-',
        },
        ],
        []
    );

    // Configuración de la tabla
    const table = useReactTable({
        data,
        columns,
        state: {
        pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: false, // Para manejar paginación en el servidor
        pageCount: 10, // Esto debería venir de la API (total de páginas)
    });


    const navigate = useNavigate();

    const handleClick = () => {
        navigate('solicitud');
    };

    const handleEditar = (row) => {
        navigate(`solicitud/${row.original.id}`);
    };
    
    // Manejar doble clic
    const handleDoubleClick = (row) => {
        //alert(`Abriendo registro con ID: ${row.original.id}`);
        console.log(row.original.id)
        navigate(`solicitud/${row.original.id}`)
    };

    return (
        
        <div style={{ padding: '20px' }}>
            <div className="headerLayoutSup">
                <h2>Solicitudes</h2>
                <button onClick={handleClick}>
                    Nuevo
                </button>
            </div>
            
            <div >
                <Outlet />
            </div>


        {/* Input de búsqueda */}
        <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            style={{ marginBottom: '10px', padding: '5px', width: '200px' }}
        />
    
        {/* Tabla */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                    <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        style={{
                            padding: '10px',
                            border: '1px solid #ddd',
                            cursor: 'pointer',
                            background: '#f5f5f5',
                        }}
                        >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted()
                            ? header.column.getIsSorted() === 'asc'
                            ? ' 🔼'
                            : ' 🔽'
                            : null}
                    </th>
                ))}
                </tr>
            ))}
            </thead>
            <tbody>
            {loading ? (
                <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                    Cargando...
                </td>
                </tr>
            ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                    Sin datos
                </td>
                </tr>
            ) : (
                table.getRowModel().rows.map((row) => (
                <tr
                    key={row.id}
                    onDoubleClick={() => handleDoubleClick(row)}
                    style={{ cursor: 'pointer' }}
                >
                    {row.getVisibleCells().map((cell) => (
                    <td
                        key={cell.id}
                        style={{ padding: '10px', border: '1px solid #ddd' }}
                    >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                    ))}
                </tr>
                ))
            )}
            </tbody>
        </table>
    
        {/* Controles de paginación */}
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            >
            Anterior
            </button>
            <span>
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </span>
            <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            >
            Siguiente
            </button>
            <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
            {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                Mostrar {size}
                </option>
            ))}
            </select>
        </div>
    </div>
    );

    
};