// src/components/map/RoutePolyline.jsx
import React from 'react';
import { Polyline } from 'react-leaflet';
import { gridToMapCoords } from '../../utils/transformCoords';

/**
 * Draws a blue polyline for the current floor.
 * Supports both: { coordinates: {x, y, floor} } and flat { x, y, floor }
 */
const RoutePolyline = ({ route,  }) => {
  if (!Array.isArray(route) || route.length === 0) return null;

  const latLngs = route
    // .filter((p) => {
    //   const floor = p.coordinates?.floor ?? p.floor ?? 'G'; // safer fallback order
    //   return String(floor) === String(currentFloor);
    // })
    .map((p) => {
      const { x, y } = p.coordinates ?? p;
      const { lat, lng } = gridToMapCoords({ x, y });
      return [lat, lng];
    })
    .filter(([lat, lng]) => lat !== undefined && lng !== undefined); // skip invalid points

  return latLngs.length ? (
    <Polyline
      positions={latLngs}
      pathOptions={{ color: '#0ea5e9', weight: 4 }}
    />
  ) : null;
};

export default RoutePolyline;
