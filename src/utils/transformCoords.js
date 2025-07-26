import { GRID_HEIGHT, SCALE_X, SCALE_Y } from './mapConfig';

export const gridToMapCoords = ({ x, y }) => ({
  lng: x * SCALE_X,
  lat: y * SCALE_Y,            
});


export const mapToGridCoords = ({ lng, lat }) => ({
  x: parseFloat((lng / SCALE_X).toFixed(2)),
  y: parseFloat((lat / SCALE_Y).toFixed(2)),
});
