
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <motion.nav 
      className="bg-white shadow-lg sticky top-0 z-50 py-4 border-b border-gray-100"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl font-bold bg-gradient-to-r from-tech-blue to-tech-purple bg-clip-text text-transparent">
              TechStore
            </span>
            <motion.div 
              className="bg-gradient-to-r from-tech-blue-light to-tech-purple-light h-2 w-2 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </Link>
          
          <div className="flex space-x-2">
            <NavLink to="/productos" currentPath={location.pathname}>
              Productos
            </NavLink>
            <NavLink to="/ventas" currentPath={location.pathname}>
              Ventas
            </NavLink>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const NavLink = ({ to, children, currentPath }) => {
  const isActive = currentPath.includes(to);
  
  return (
    <Link to={to}>
      <motion.div
        className={`px-4 py-2 rounded-xl font-medium transition-all relative ${
          isActive ? 'text-white' : 'text-tech-gray hover:text-tech-blue'
        }`}
        whileHover={!isActive && { scale: 1.05 }}
        whileTap={!isActive && { scale: 0.95 }}
      >
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-tech-blue to-tech-purple rounded-xl"
            layoutId="navbar-active"
            initial={false}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
        <span className={`relative z-10 ${isActive ? 'font-semibold' : ''}`}>{children}</span>
      </motion.div>
    </Link>
  );
};

export default Navbar;
