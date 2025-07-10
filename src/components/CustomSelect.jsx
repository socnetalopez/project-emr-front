import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

function ApiSelect({
  optionsData = [],
  value,
  onChange,
  isLoading = false,
  isInvalid = false,
  errorMessage = '',
  onCreate = null,
  apiUrl = '',
  refreshOptions = () => {},
  fields = [{ name: 'name', label: 'Nombre' }],
}) {
  const safeOptions = Array.isArray(optionsData) ? optionsData : [];

  const formattedOptions = safeOptions.map(item => ({
    value: item.id ?? item.value,
    label: item.name || item.label || item.value || item.id,
    raw: item,
  }));

  const [showModal, setShowModal] = useState(false);
  const [newItemData, setNewItemData] = useState(() =>
    Object.fromEntries(fields.map(f => [f.name, '']))
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field, val) => {
    setNewItemData(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = async () => {
    const isValid = Object.values(newItemData).every(val => val.trim() !== '');
    if (!isValid) return;

    setIsSaving(true);
    try {
      if (onCreate && typeof onCreate === 'function') {
        await onCreate(newItemData);
      } else if (apiUrl) {
        await axios.post(apiUrl, newItemData);
      } else {
        throw new Error('No se ha proporcionado onCreate ni apiUrl');
      }

      setShowModal(false);
      setNewItemData(Object.fromEntries(fields.map(f => [f.name, ''])));
      await refreshOptions();
    } catch (error) {
      console.error('Error al guardar nuevo ítem:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedOption = formattedOptions.find(opt => opt.value === value) || null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ flexGrow: 1 }}>
        <Select
          options={formattedOptions}
          value={selectedOption}
          onChange={selected => onChange(selected ? selected.value : null)}
          isClearable
          placeholder="Selecciona una opción..."
          styles={{
            control: (base, state) => ({
              ...base,
              minHeight: '30px',
              height: '30px',
              fontSize: '12px',
              borderColor: isInvalid ? 'red' : base.borderColor,
              boxShadow: isInvalid ? '0 0 0 1px red' : state.isFocused ? base.boxShadow : 'none',
              '&:hover': {
                borderColor: isInvalid ? 'red' : base.borderColor,
              },
            }),
            valueContainer: base => ({
              ...base,
              height: '30px',
              padding: '0 6px',
            }),
            input: base => ({
              ...base,
              margin: 0,
              padding: 0,
              fontSize: '12px',
            }),
            indicatorsContainer: base => ({
              ...base,
              height: '30px',
            }),
            dropdownIndicator: base => ({
              ...base,
              padding: '4px',
            }),
            clearIndicator: base => ({
              ...base,
              padding: '4px',
            }),
            option: base => ({
              ...base,
              fontSize: '12px',
              padding: '6px 10px',
            }),
          }}
          isLoading={isLoading}
        />
        {isInvalid && (
          <small style={{ color: 'red', fontSize: '0.75rem' }}>
            {errorMessage || 'Este campo es obligatorio'}
          </small>
        )}
      </div>

      {(onCreate || apiUrl) && (
        <button
          type="button"
          onClick={() => setShowModal(true)}
          style={{
            padding: '0 10px',
            fontSize: '18px',
            color: 'white',
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '4px',
            height: '30px',
            cursor: 'pointer',
          }}
          title="Agregar nuevo"
        >
          +
        </button>
      )}

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '320px',
              boxShadow: '0 0 10px rgba(0,0,0,0.25)',
              fontSize: '14px',
            }}
          >
            <h4 style={{ marginBottom: '15px' }}>Agregar nuevo</h4>

            {fields.map(field => (
              <input
                key={field.name}
                type="text"
                placeholder={field.label}
                value={newItemData[field.name]}
                onChange={e => handleInputChange(field.name, e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px',
                  marginBottom: '10px',
                  fontSize: '12px',
                  boxSizing: 'border-box',
                }}
              />
            ))}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                {isSaving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApiSelect;
