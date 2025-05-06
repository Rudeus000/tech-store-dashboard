
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
          className={`w-full p-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all`}
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
          className={`w-full p-3 border ${error ? 'border-red-500' : 'border-gray-300'} ${prefix ? 'pl-6' : ''} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all`}
          disabled={disabled}
          step={type === "number" ? "any" : undefined}
        />
      </div>
    );
  };
  
  return (
    <motion.div 
      className="mb-4"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      {renderField()}
      {error && (
        <motion.span 
          className="text-xs text-red-500 mt-1 block"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {error}
        </motion.span>
      )}
    </motion.div>
  );
};

export default FormField;
