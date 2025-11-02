import React from "react";
import { CircleMarker, Tooltip } from "react-leaflet";
import { gridToMapCoords } from "../../utils/transformCoords";

const MarkerLayer = ({
  nodes = [],
  userLocation,
  currentFloorId,
  onMarkerClick,
  selectedNodeId,
  highlightedNodeId,
}) => {
  if (!nodes.length && !userLocation) return null;

  const renderCircle = (
    latLng,
    key,
    { color = "#333", radius = 6, tooltip, onClick, visible = true } = {}
  ) => (
    <CircleMarker
      key={key}
      center={latLng}
      radius={radius}
      pathOptions={{
        color,
        fillColor: color,
        opacity: visible ? 1 : 0,
        fillOpacity: visible ? 0.9 : 0,
      }}
      eventHandlers={onClick ? { click: onClick } : {}}
    >
      {tooltip && (
        <Tooltip direction="top" offset={[0, -8]} opacity={1}>
          {tooltip}
        </Tooltip>
      )}
    </CircleMarker>
  );

  const floorNodes = nodes.filter(
    (n) => String(n.coordinates.floor) === String(currentFloorId)
  );

  return (
    <>
      {/* Hidden normal nodes */}
      {floorNodes.map((node) => {
        const { lat, lng } = gridToMapCoords({
          ...node.coordinates,
          floor: currentFloorId,
        });
        const color =
          highlightedNodeId === node.nodeId
            ? "limegreen"
            : selectedNodeId === node.nodeId
            ? "red"
            : "#333";

        // Tooltip only if it's a room
        const tooltip = node.type === "room" ? node.name : null;

        return renderCircle([lat, lng], node.nodeId, {
          color,
          radius: 6,
          tooltip,
          onClick: () => onMarkerClick?.(node),
          visible: false, // hide normal markers
        });
      })}

      {/* Visible user marker */}
      {userLocation &&
        (() => {
          const point = userLocation.coordinates ?? userLocation;
          const { lat, lng } = gridToMapCoords({
            ...point,
            floor: currentFloorId,
          });
          return renderCircle([lat, lng], "user-dot", {
            color: "dodgerblue",
            radius: 7,
            tooltip: "You",
            visible: true,
          });
        })()}
    </>
  );
};

export default MarkerLayer;
