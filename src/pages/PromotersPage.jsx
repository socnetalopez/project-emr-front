import React from 'react';
import { Link, useNavigate } from "react-router-dom"

import  PromoterLists  from '../Features/Promoters/ListPromoters';

export function PromotersPage() {
    
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/dashboard/promotor');
    };

    return (

      <div>
        <PromoterLists />
      </div>
    );
  }