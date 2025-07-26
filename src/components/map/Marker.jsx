import React from 'react';
import { CircleMarker, Tooltip } from 'react-leaflet';
import { gridToMapCoords } from '../../utils/transformCoords';
import { MAP_HEIGHT, GRID_HEIGHT } from '../../utils/mapConfig';

/**
 * MarkerLayer – renders invisible tap‑targets for nodes + visible blue‑dot.
 * Nodes are fully transparent unless selected/highlighted or `forceVisibleMarkers` is true.
 */
const MarkerLayer = ({
  nodes = [],
  userLocation,
  onMarkerClick,
  selectedNodeId,
  highlightedNodeId,
  forceVisibleMarkers = false,
}) => {
  if (!nodes.length && !userLocation) return null;

  const renderCircle = (
    latLng,
    key,
    { visible = false, color = '#333', radius = 6, tooltip, onClick } = {}
  ) => (
    <CircleMarker
      key={key}
      center={latLng}
      radius={radius}
      pathOptions={{
        color: visible ? color : 'transparent',
        fillColor: visible ? color : 'transparent',
        opacity: visible ? 1 : 0,
        fillOpacity: visible ? 0.9 : 0,
      }}
      eventHandlers={onClick && { click: onClick }}
    >
      {visible && tooltip && (
        <Tooltip direction="top" offset={[0, -8]} opacity={1}>
          {tooltip}
        </Tooltip>
      )}
    </CircleMarker>
  );

  return (
    <>
      {/* Node markers */}
      {nodes.map((node) => {
        const { lat, lng } = gridToMapCoords(
          node.coordinates,
          MAP_HEIGHT,
          GRID_HEIGHT
        );

        const isHighlighted = highlightedNodeId === node.nodeId;
        const isSelected = selectedNodeId === node.nodeId;
        const visible = forceVisibleMarkers || isHighlighted || isSelected;

        const color = isHighlighted
          ? 'limegreen'
          : isSelected
          ? 'red'
          : '#333';

        return renderCircle([lat, lng], node.nodeId, {
          visible,
          color,
          radius: visible ? 6 : 12,
          tooltip: node.name,
          onClick: () => onMarkerClick?.(node),
        });
      })}

      {/* Blue-dot user location */}
      {userLocation &&
        (() => {
          const point = userLocation.coordinates ?? userLocation;
          const { lat, lng } = gridToMapCoords(
            point,
            MAP_HEIGHT,
            GRID_HEIGHT
          );
          return renderCircle([lat, lng], 'user-dot', {
            visible: true,
            color: 'dodgerblue',
            radius: 7,
            tooltip: 'You',
          });
        })()}
    </>
  );
};

export default MarkerLayer;
