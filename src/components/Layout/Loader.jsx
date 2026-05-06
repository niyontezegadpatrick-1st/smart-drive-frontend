import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-dark-200 to-dark-100 flex flex-col items-center justify-center z-50"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-20 h-20 border-4 border-white/20 border-t-blue-500 border-r-blue-400 rounded-full"
      />
      <motion.p
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-white mt-4 text-lg tracking-wider font-medium"
      >
        Loading Smart Drive...
      </motion.p>
    </motion.div>
  );
};

export default Loader;