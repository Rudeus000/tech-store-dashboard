
import React from 'react';
import { motion } from 'framer-motion';

const ElegantForm = ({ title, children, onCancel, onSubmit, submitText = "Guardar", color = "blue" }) => {
  const gradientColors = {
    blue: "from-tech-blue to-tech-purple",
    orange: "from-tech-orange to-tech-pink"
  };

  return (
    <motion.div
      className="w-full rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-100"
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.97 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
    >
      <div className={`bg-gradient-to-r ${gradientColors[color]} p-6 text-white`}>
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <motion.div 
            className="w-2 h-8 bg-white/50 rounded-full"
            initial={{ height: 0 }}
            animate={{ height: "2rem" }}
            transition={{ delay: 0.2, duration: 0.5 }}
          />
          {title}
        </h2>
      </div>
      
      <motion.form 
        onSubmit={onSubmit}
        className="p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="space-y-6">
          {children}
          
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-8">
            {onCancel && (
              <motion.button
                type="button"
                onClick={onCancel}
                className="px-6 py-2.5 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Cancelar
              </motion.button>
            )}
            
            <motion.button
              type="submit"
              className={`px-6 py-2.5 rounded-xl font-medium bg-gradient-to-r ${gradientColors[color]} text-white shadow-md hover:shadow-lg transition-all`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {submitText}
            </motion.button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default ElegantForm;
