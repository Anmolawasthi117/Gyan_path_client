// src/components/splash/MapLoader.jsx
const MapLoader = () => {
  return (
    <div className="absolute inset-0 z-40 bg-white flex items-center justify-center">
      <div className="animate-pulse text-gray-400 text-sm">Loading map...</div>
    </div>
  );
};

export default MapLoader;
