import React, { useState, useEffect } from "react";

const MarkerLayer = ({
  nodes = [],
  userLocation,
  onMarkerClick,
  selectedNodeId,
  highlightedNodeId,
  renderSize = { width: 0, height: 0, offsetX: 0, offsetY: 0 },
  zoom = 1,
}) => {
  const [activeTooltip, setActiveTooltip] = useState(null); // which node's tooltip is open

  useEffect(() => {
    // close tooltip when clicking outside markers (mobile-friendly)
    const handleClickOutside = () => setActiveTooltip(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  if (!renderSize.width || !renderSize.height) return null;

  const BASE_RADIUS = 6;

  const getScreenPosition = (node) => {
    const coords = node.coordinates ? node.coordinates : node;
    const pctX = Number(coords.x);
    const pctY = Number(coords.y);

    const x = renderSize.offsetX + (pctX / 100) * renderSize.width;
    const y = renderSize.offsetY + (pctY / 100) * renderSize.height;
    return { x, y };
  };

  const renderDot = (node, key, { color = "#333", tooltip } = {}) => {
    const pos = getScreenPosition(node);
    const size = BASE_RADIUS * 2;
    const isActive = activeTooltip === key;

    return (
      <div
        key={key}
        onMouseEnter={() => setActiveTooltip(key)}
        onMouseLeave={() => setActiveTooltip(null)}
        onClick={(e) => {
          e.stopPropagation();
          // toggle tooltip on mobile tap
          setActiveTooltip((prev) => (prev === key ? null : key));
          onMarkerClick?.(node);
        }}
        style={{
          position: "absolute",
          left: pos.x,
          top: pos.y,
          transform: "translate(-50%, -50%)",
          width: size / zoom,
          height: size / zoom,
          borderRadius: "50%",
          backgroundColor: color,
          opacity: 0.9,
          cursor: "pointer",
          transition: "all 0.15s ease-out",
          pointerEvents: "auto",
          zIndex: isActive ? 10 : 1,
        }}
      >
        {tooltip && isActive && (
          <div
            style={{
              position: "absolute",
              bottom: "150%",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#222",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              opacity: 0.95,
              pointerEvents: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            {tooltip}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {nodes.map((node) => {
        const isHighlighted = highlightedNodeId === node.nodeId;
        const isSelected = selectedNodeId === node.nodeId;
        const color = isHighlighted
          ? "limegreen"
          : isSelected
          ? "red"
          : "#333";

        return renderDot(node, node.nodeId, {
          color,
          tooltip: node.name,
        });
      })}

      {userLocation &&
        renderDot(userLocation, "user-dot", {
          color: "dodgerblue",
          tooltip: "You",
        })}
    </>
  );
};

export default MarkerLayer;
