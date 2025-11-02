// src/utils/transformCoords.js
import { floorDimensions } from "./mapConfig";

/**
 * Convert grid coordinates (0–100) to Leaflet CRS.Simple coordinates (pixels)
 * for a specific floor.
 * Flip Y for nodes so 0 is bottom → 100 top
 */
export const gridToMapCoords = ({ x, y, floor, isUser = false }) => {
  const dims = floorDimensions[floor] || { width: 2000, height: 3000 };

  return {
    lng: Math.max(0, Math.min((x / 100) * dims.width, dims.width)),
    lat: Math.max(
      0,
      Math.min(isUser ? (y / 100) * dims.height : ((100 - y) / 100) * dims.height, dims.height)
    ),
  };
};

/**
 * Convert Leaflet CRS.Simple coordinates (pixels) back to grid coordinates (0–100)
 * Flip Y for nodes
 */
export const mapToGridCoords = ({ lng, lat, floor }) => {
  const dims = floorDimensions[floor] || { width: 2000, height: 3000 };
  return {
    x: parseFloat(((Math.max(0, Math.min(lng, dims.width)) / dims.width) * 100).toFixed(2)),
    y: parseFloat(
      ((1 - Math.max(0, Math.min(lat, dims.height)) / dims.height) * 100).toFixed(2)
    ),
  };
};

/**
 * Clamp a grid point (0–100) to be inside map bounds
 */
export const clampGridPoint = (pt, floor) => ({
  x: Math.max(0, Math.min(pt.x, 100)),
  y: Math.max(0, Math.min(pt.y, 100)),
  floor,
});
