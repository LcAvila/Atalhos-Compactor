import { motion } from 'framer-motion';
import React, { useState } from 'react';

const Radio = () => {
  const [selected, setSelected] = useState('producao');

  return (  
    <motion.div
      initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut'
        }}
     className="flex items-center py-2 justify-center bg-transparent">
      <div className="relative flex items-center rounded-lg bg-gray-100 w-64 overflow-hidden drop-shadow-xl">
        <label 
          className="w-1/2 py-2.5 cursor-pointer flex justify-center items-center z-10 font-semibold text-sm transition-colors duration-150"
          style={{ color: selected === 'producao' ? '#fff' : '#333' }}
        >
          <input
            type="radio"
            name="ambiente"
            value="producao"
            checked={selected === 'producao'}
            onChange={(e) => setSelected(e.target.value)}
            className="hidden"
          />
          <span>Produção</span>
        </label>

        <label 
          className="w-1/2 py-2.5 cursor-pointer flex justify-center items-center z-10 font-semibold text-sm transition-colors duration-150"
          style={{ color: selected === 'homologacao' ? '#fff' : '#333' }}
          
        >
          <input
            type="radio"
            name="ambiente"
            value="homologacao"
            checked={selected === 'homologacao'}
            onChange={(e) => setSelected(e.target.value)}
            className="hidden"
          />
          <span>Homologação</span>
        </label>

        <span 
          className="absolute h-full w-1/2 top-0 transition-transform duration-150 ease-in-out"
          style={{
            backgroundColor: selected === 'producao' ? '#008800' : '#ff0000',
            transform: selected === 'producao' ? 'translateX(0)' : 'translateX(100%)',
          }}
        />
      </div>
    </motion.div>
  );
};

export default Radio;