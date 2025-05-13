import React from 'react';
import { Link, useNavigate } from "react-router-dom"

import CustomersLists from '../components/Customers/ListCustomer';

export function CustomersPage() {

  const navigate = useNavigate();
    const handleClick = () => {
        navigate('/dashboard/customer');
  };

    return (
      <div >
        <h1 className="font-bold uppercase">Customers
        <button onClick={handleClick} >   Nuevo</button> </h1>
            <CustomersLists />
      </div>
    );
  }