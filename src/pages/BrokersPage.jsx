import React from 'react';
import { Link, useNavigate } from "react-router-dom"

import { BrokersList } from '../components/Brokers/ListsBrokers';

export function BrokersPage() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/dashboard/broker');
    };
        
    return (
        <div>
        <h1 className="font-bold p-5 uppercase"> Brokers
            <button onClick={handleClick} >Nuevo</button> </h1>
            <BrokersList />
    </div>);
}
