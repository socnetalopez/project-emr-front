import React from 'react';
import { Link, useNavigate } from "react-router-dom"

import { ComisionistasLists } from '../components/Comisionistas/ListComisionistas';

export function ComisionistaPage() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/dashboard/comisionista');
    };
        
    return (
        <div>
        <h1 className="font-bold p-5 uppercase"> Comisionistas
            <button onClick={handleClick} >Nuevo</button> </h1>
            <ComisionistasLists />
    </div>);
}
