
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, ShoppingBag, Settings, Menu } from 'lucide-react';

const AppSidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  
  const menuItems = [
    { title: 'Inicio', icon: Home, path: '/' },
    { title: 'Productos', icon: Package, path: '/productos' },
    { title: 'Ventas', icon: ShoppingBag, path: '/ventas' },
    { title: 'Configuración', icon: Settings, path: '/configuracion' }
  ];

  const sidebarVariants = {
    expanded: { width: '240px' },
    collapsed: { width: '70px' }
  };

  const menuItemVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -10 }
  };

  return (
    <>
      <motion.div 
        className="fixed top-0 left-0 h-screen z-20 flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl"
        initial="expanded"
        animate={collapsed ? 'collapsed' : 'expanded'}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <motion.div 
            variants={{
              expanded: { opacity: 1, display: 'block' },
              collapsed: { opacity: 0, transitionEnd: { display: 'none' } }
            }}
            className="font-semibold text-xl"
          >
            Sistema
          </motion.div>
          <button 
            className="p-2 rounded-md hover:bg-gray-700 transition-colors"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu size={20} />
          </button>
        </div>
        
        <div className="flex flex-col flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.title} 
                to={item.path}
                className={`flex items-center px-4 py-3 mb-1 mx-2 rounded-lg transition-all duration-300 ${
                  isActive ? 'bg-blue-700' : 'hover:bg-gray-700'
                }`}
              >
                <motion.div
                  className={`${isActive ? 'text-white' : 'text-gray-300'}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon size={20} />
                </motion.div>
                <motion.span 
                  variants={menuItemVariants}
                  transition={{ duration: 0.2 }}
                  className={`ml-4 ${isActive ? 'font-medium' : ''}`}
                >
                  {item.title}
                </motion.span>
              </Link>
            );
          })}
        </div>
      </motion.div>
      
      {collapsed && (
        <motion.div 
          className="fixed top-1/2 left-[70px] z-10 -translate-y-1/2 bg-gray-800 text-white rounded-r-full px-2 py-10 cursor-pointer shadow-lg"
          onClick={() => setCollapsed(false)}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ x: 3 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}
    </>
  );
};

export default AppSidebar;
