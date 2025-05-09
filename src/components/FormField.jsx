
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
  disabled = false,
  compact = false
}) => {
  const renderField = () => {
    if (type === "select") {
      return (
        <motion.div 
          className="relative"
          whileTap={{ scale: 0.99 }}
        >
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full ${compact ? 'p-2 text-sm' : 'p-3'} border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all`}
            disabled={disabled}
          >
            <option value="">{placeholder}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </motion.div>
      );
    }
    
    return (
      <motion.div 
        className="relative"
        whileTap={{ scale: 0.99 }}
      >
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
          className={`w-full ${compact ? 'p-2 text-sm' : 'p-3'} border ${error ? 'border-red-500' : 'border-gray-300'} ${prefix ? 'pl-6' : ''} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all`}
          disabled={disabled}
          step={type === "number" ? "any" : undefined}
        />
        {type === "date" && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        )}
      </motion.div>
    );
  };
  
  return (
    <motion.div 
      className={`${compact ? 'mb-3' : 'mb-4'}`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label htmlFor={name} className={`block ${compact ? 'text-xs mb-1' : 'text-sm mb-1'} font-medium text-gray-700`}>
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
