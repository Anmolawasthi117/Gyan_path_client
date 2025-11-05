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
  destinationNodeId, // ✅ new prop
}) => {
  if (!nodes.length && !userLocation && !destinationNodeId) return null;

  const renderCircle = (
    latLng,
    key,
    { color = "#333", radius = 6, tooltip, onClick, visible = true, dashArray } = {}
  ) => (
    <CircleMarker
      key={key}
      center={latLng}
      radius={radius}
      pathOptions={{
        color,
        fillColor: color,
        dashArray,
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

        const isDestination = node.nodeId === destinationNodeId;
        const isHighlighted = highlightedNodeId === node.nodeId;
        const isSelected = selectedNodeId === node.nodeId;

        // Different color priorities
        let color = "#333";
        if (isDestination) color = "#00D100";
        else if (isHighlighted) color = "limegreen";
        else if (isSelected) color = "red";

        const tooltip =
          node.type === "room" || isDestination ? node.name : null;

        return renderCircle([lat, lng], node.nodeId, {
          color,
          radius: isDestination ? 9 : 6,
          tooltip,
          onClick: () => onMarkerClick?.(node),
          visible: isDestination, // only show destination visibly
          dashArray: isDestination ? "4 2" : undefined, // dotted circle look
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
            color: "#00D100",
            radius: 7,
            tooltip: "You",
            visible: true,
          });
        })()}
    </>
  );
};

export default MarkerLayer;
