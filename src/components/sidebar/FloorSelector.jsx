import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FloorSelector = ({ floors = [], currentFloor, onChange }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (floor) => {
    onChange?.(floor);
    setOpen(false);
  };

  return (
    <div className="absolute bottom-24 right-4 z-40">
      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 text-white text-sm px-4 py-2 rounded-xl shadow-lg backdrop-blur hover:bg-blue-700 transition-all"
      >
        Floor: {currentFloor} ⌄
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-2 bg-white text-black rounded-xl shadow-xl p-2 flex flex-col space-y-1"
          >
            {floors.map((floor) => (
              <button
                key={floor}
                onClick={() => handleSelect(floor)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  floor === currentFloor
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                Floor {floor}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloorSelector;
