// src/components/map/Map.jsx
import React, { useMemo } from 'react';
import {
  MapContainer,
  ImageOverlay,
  useMapEvents,
  ZoomControl,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import mapFloorG from '../../assets/floor1_ggits.jpeg';
import mapFloor2 from '../../assets/floor2_ggits.jpg';
import mapMBA from '../../assets/floor1_mba.png';

import MarkerLayer from './Marker';
import RoutePolyline from './RoutePolyline';
import ConnectedEdges from './ConnectedEdges';

import { MAP_WIDTH, MAP_HEIGHT } from '../../utils/mapConfig';
import { mapToGridCoords } from '../../utils/transformCoords';

const floorImages = {
  G: mapFloorG,      // default ground floor
  "1": mapFloor2,    // first floor
  MBA: mapMBA,       // MBA floor
};

const MapEvents = ({ onSelectLocation }) => {
  useMapEvents({
    dblclick(e) {
      if (!onSelectLocation) return;
      const { lat, lng } = e.latlng;
      const { x, y } = mapToGridCoords({ lat, lng });
      onSelectLocation({ x, y });
    },
  });
  return null;
};

const Map = ({
  mode = 'user',
  userLocation,
  onSelectLocation,
  nodes = [],
  route = [],
  currentFloor = 'G',
  extraNodes = [],
  onMarkerClick,
  selectedNodeId,
  highlightedNodeId,
  forceVisibleMarkers = false,
}) => {
  const allMarkers = useMemo(() => {
    const sameFloor = (n) =>
      String(n?.coordinates?.floor) === String(currentFloor);
    return [...nodes.filter(sameFloor), ...extraNodes.filter(sameFloor)];
  }, [nodes, extraNodes, currentFloor]);

  const bounds = useMemo(
    () => [
      [0, 0],
      [MAP_HEIGHT, MAP_WIDTH],
    ],
    []
  );

  return (
    <div className="absolute inset-0 w-full h-full z-0 bg-gray-200">
      <div className="w-full h-full shadow-xl rounded-b-2xl overflow-hidden">
        <MapContainer
          crs={L.CRS.Simple}
          bounds={bounds}
          maxBounds={bounds}
          maxBoundsViscosity={1.0}
          maxZoom={5}
          minZoom={-2}
          zoomSnap={0.5}
          zoomDelta={0.5}
          doubleClickZoom={false}
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <ImageOverlay
            url={floorImages[currentFloor] || mapFloorG}
            bounds={bounds}
          />
          <ZoomControl position="bottomright" />
          {mode === 'admin' && <ConnectedEdges nodes={allMarkers} />}
          <MarkerLayer
            nodes={allMarkers}
            userLocation={userLocation}
            onMarkerClick={onMarkerClick}
            selectedNodeId={selectedNodeId}
            highlightedNodeId={highlightedNodeId}
            forceVisibleMarkers={forceVisibleMarkers}
          />
          <RoutePolyline route={route} currentFloor={currentFloor} />
          {onSelectLocation && <MapEvents onSelectLocation={onSelectLocation} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
