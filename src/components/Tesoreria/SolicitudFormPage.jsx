///
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { formatDate } from "date-fns";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";
import { createSolicitud, updateSolicitud, getSolicitud } from "../../api/solicitudes.api"
//import '../CSS/Requests.css';

import  SolicitudGeneral from "./SolicitudGenerales";

export function SolicitudFormPage() {
  const { id } = useParams();
  console.log("id",id)
  const hayId = !!id; // convierte a booleano
  return (
    <div className="contenedor">
    {/*
      }  {hayId ? (
        <p>Se recibió un ID en la URL: {id}</p>
      ) : (
        <p>No se recibió ningún ID en la URL.</p>
      )}

    */}    
      
      <SolicitudGeneral id={id}/> {/* Mostramos el formulario */}
    </div>
    
  );
}
