import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import { gridToMapCoords } from "../../utils/transformCoords";

const RoutePolyline = ({ route = [], currentFloor }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !route || route.length < 1) return;

    // Only use nodes on the current floor
    const floorRoute = route.filter(n => String(n.coordinates.floor) === String(currentFloor));
    if (floorRoute.length < 2) return;

    // Convert nodes to Leaflet lat/lng
    const latlngs = floorRoute.map(n => {
      const { lat, lng } = gridToMapCoords({ ...n.coordinates, floor: currentFloor });
      return [lat, lng];
    });

    const polyline = L.polyline(latlngs, { color: "#0ea5e9", weight: 3 }).addTo(map);

    return () => {
      map.removeLayer(polyline);
    };
  }, [map, route, currentFloor]);

  return null;
};

export default RoutePolyline;
