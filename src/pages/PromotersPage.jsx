import React from 'react';
import { Link, useNavigate } from "react-router-dom"

import  PromoterLists  from '../components/Promoters/ListPromoters';

export function PromotersPage() {
    
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/dashboard/promotor');
    };

    return (
      <div >
        <h1 className="font-bold p-5 uppercase">Promotors  
        <button onClick={handleClick} >Nuevo</button> </h1>
            <PromoterLists />
      </div>
    );
  }