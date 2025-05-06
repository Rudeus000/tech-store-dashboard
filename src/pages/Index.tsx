
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to productos page after animation
    const timeout = setTimeout(() => {
      navigate('/productos');
    }, 1500);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.5,
          ease: "easeOut"
        }}
        className="relative"
      >
        <div className="text-5xl font-bold bg-gradient-to-r from-tech-blue via-tech-purple to-tech-pink bg-clip-text text-transparent mb-4">
          TechStore
        </div>
        <motion.div 
          className="flex justify-center gap-4 mt-8"
          animate={{
            y: [0, -10, 0],
            opacity: [1, 0.7, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="h-3 w-3 rounded-full bg-tech-blue-light"></div>
          <div className="h-3 w-3 rounded-full bg-tech-purple-light animate-pulse" style={{ animationDelay: "0.2s" }}></div>
          <div className="h-3 w-3 rounded-full bg-tech-pink-light animate-pulse" style={{ animationDelay: "0.4s" }}></div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Index;
