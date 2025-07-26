import React from 'react';
import { useMap } from 'react-leaflet';
import { LocateFixed } from 'lucide-react';

const RecenterButton = ({ userLocation }) => {
  const map = useMap();

  const handleClick = () => {
    if (userLocation) {
      const { x, y } = userLocation;
      map.setView([y, x], map.getZoom(), { animate: true });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 z-50 p-2 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-100 transition"
      title="Re-center to my location"
    >
      <LocateFixed size={20} />
    </button>
  );
};

export default RecenterButton;
