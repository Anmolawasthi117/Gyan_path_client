import React from 'react';
import { CircleMarker, Tooltip } from 'react-leaflet';

const UserMarker = ({ userLocation }) => {
  if (!userLocation) return null;

  const { x, y } = userLocation;

  return (
    <CircleMarker
      center={[y, x]} // Leaflet uses [lat, lng] → your grid is [y, x]
      radius={6}
      color="blue"
      fillColor="blue"
      fillOpacity={0.8}
    >
      <Tooltip direction="top" offset={[0, -6]} opacity={1}>
        You
      </Tooltip>
    </CircleMarker>
  );
};

export default UserMarker;
