// components/RadioButtons.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

type Ambiente = 'producao' | 'homologacao';

interface RadioButtonsProps {
  onChange?: (value: Ambiente) => void;
}

const RadioButtons: React.FC<RadioButtonsProps> = ({ onChange }) => {
  const [selected, setSelected] = useState<Ambiente>('producao');

  const handleChange = (value: Ambiente) => {
    setSelected(value);
    if (onChange) onChange(value);
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex items-center pb-2 justify-center"
    >
      <div className="relative flex h-10 items-center rounded-2xl bg-gray-100 w-64 border-4 border-gray-100 overflow-hidden drop-shadow-xl select-none">
        <label
          className="w-1/2 py-2.5 cursor-pointer flex justify-center items-center z-10 font-semibold text-sm select-none"
          style={{ color: selected === 'producao' ? '#fff' : '#333' }}
        >
          <input
            type="radio"
            name="ambiente"
            value="producao"
            checked={selected === 'producao'}
            onChange={() => handleChange('producao')}
            className="hidden"
          />
          Produção
        </label>

        <label
          className="w-1/2 py-2.5 cursor-pointer flex justify-center items-center z-10 font-semibold text-sm select-none"
          style={{ color: selected === 'homologacao' ? '#fff' : '#333' }}
        >
          <input
            type="radio"
            name="ambiente"
            value="homologacao"
            checked={selected === 'homologacao'}
            onChange={() => handleChange('homologacao')}
            className="hidden"
          />
          Homologação
        </label>

        <span
          className="absolute h-full w-1/2 top-0 transition-transform duration-150 ease-in-out pointer-events-none"
          style={{
            backgroundColor: selected === 'producao' ? '#008800' : '#ff0000',
            transform: selected === 'producao' ? 'translateX(0)' : 'translateX(100%)',
          }}
        />
      </div>
    </motion.div>
  );
};

export default RadioButtons;
