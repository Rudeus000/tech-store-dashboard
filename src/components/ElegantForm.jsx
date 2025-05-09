
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ElegantForm = ({ 
  title, 
  children, 
  onCancel, 
  onSubmit, 
  submitText = "Guardar", 
  color = "blue",
  isModal = false,
  compact = false
}) => {
  const buttonStyles = {
    blue: "bg-blue-600 hover:bg-blue-700",
    orange: "bg-orange-500 hover:bg-orange-600"
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 300 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { 
        duration: 0.2 
      }
    }
  };

  const containerClass = isModal 
    ? "fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4" 
    : "w-full";

  const formClass = isModal 
    ? `bg-white rounded-xl shadow-xl w-full max-w-${compact ? 'sm' : 'md'} overflow-hidden` 
    : "bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden";

  return (
    <motion.div
      className={containerClass}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={formClass}>
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
          <h2 className={`${compact ? 'text-lg' : 'text-xl'} font-semibold text-gray-800`}>{title}</h2>
          {isModal && (
            <motion.button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={compact ? 18 : 20} />
            </motion.button>
          )}
        </div>
        
        <motion.form 
          onSubmit={onSubmit}
          className={`px-6 py-3 ${compact ? 'space-y-3' : 'space-y-4'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {children}
          
          <div className={`flex justify-end gap-2 mt-4 pt-3 ${compact ? '' : 'border-t border-gray-200'}`}>
            {onCancel && (
              <motion.button
                type="button"
                onClick={onCancel}
                className={`px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors ${compact ? 'text-sm' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancelar
              </motion.button>
            )}
            
            <motion.button
              type="submit"
              className={`px-3 py-1.5 rounded-lg text-white font-medium ${buttonStyles[color]} transition-colors ${compact ? 'text-sm' : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {submitText}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default ElegantForm;
