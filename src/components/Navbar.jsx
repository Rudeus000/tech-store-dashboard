
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <motion.nav 
      className="bg-white shadow-md py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-tech-blue-dark text-2xl font-bold">
            TechStore
          </Link>
          
          <div className="flex space-x-4">
            <Link 
              to="/productos" 
              className={`px-3 py-2 rounded-md font-medium transition-colors ${
                location.pathname.includes('/productos') 
                  ? 'bg-tech-blue text-white' 
                  : 'text-tech-gray hover:bg-tech-blue hover:text-white'
              }`}
            >
              Productos
            </Link>
            <Link 
              to="/ventas" 
              className={`px-3 py-2 rounded-md font-medium transition-colors ${
                location.pathname.includes('/ventas') 
                  ? 'bg-tech-blue text-white' 
                  : 'text-tech-gray hover:bg-tech-blue hover:text-white'
              }`}
            >
              Ventas
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
