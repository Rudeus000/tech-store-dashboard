
import React from 'react';
import { motion } from 'framer-motion';

const FormField = ({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  placeholder = "", 
  error,
  prefix,
  options,
  disabled = false
}) => {
  const renderField = () => {
    if (type === "select") {
      return (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`form-input ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }
    
    return (
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500">{prefix}</span>
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`form-input ${prefix ? 'pl-6' : ''} ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
          disabled={disabled}
          step={type === "number" ? "any" : undefined}
        />
      </div>
    );
  };
  
  return (
    <motion.div 
      className="form-group"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label htmlFor={name} className="form-label flex items-center gap-2">
        {label}
        {error && (
          <motion.span 
            className="text-xs text-red-500 font-normal"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {error}
          </motion.span>
        )}
      </label>
      {renderField()}
    </motion.div>
  );
};

export default FormField;
