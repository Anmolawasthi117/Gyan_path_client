import React from "react";
import { FiRefreshCw } from "react-icons/fi"; // Feather icon for a clean look

const ResetUserLocation = ({ onReset }) => {
  return (
    <div className="absolute bottom-28 right-4 z-40">
      <button
        onClick={onReset}
        className="w-12 h-12 m-6 flex items-center justify-center bg-gradient-to-br from-[#2255ff] to-[#1e40af] text-white rounded-full shadow-lg transition-all"
        title="Reset User Location"
      >
        <FiRefreshCw className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ResetUserLocation;
