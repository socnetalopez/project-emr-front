import React from 'react';
import { Link, useNavigate } from "react-router-dom"

import { Movements } from '../components/Tesoreria/Movements';
import MenuLateralMovimientos from '../components/Tesoreria/MenuLateralMovimientos';


export function TreasuryPage() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/dashboard/movimientos');
    };
        
    return (
        <div>
        <h1 className="font-bold p-5 uppercase"> Tesoreria </h1>
            <Movements />
    </div>);
}
