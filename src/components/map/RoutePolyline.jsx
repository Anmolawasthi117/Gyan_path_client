// src/components/map/RoutePolyline.jsx
import React from "react";

const RoutePolyline = ({ route = [], renderSize, userLocation }) => {
  if ((!route || route.length < 1) && !userLocation) return null;

  console.log("🧭 [Drawing Polyline for Route]", route.map((n) => n.name));

  const getScreenPosition = (coords) => {
    const x = renderSize.offsetX + (coords.x / 100) * renderSize.width;
    const y = renderSize.offsetY + (coords.y / 100) * renderSize.height;
    return { x, y };
  };

  const lines = [];

  // 1️⃣ Optional: draw the segment from user location to first route node
  if (userLocation && route.length > 0) {
    const from = getScreenPosition(userLocation);
    const to = getScreenPosition(route[0].coordinates);

    const length = Math.hypot(to.x - from.x, to.y - from.y);
    const angle = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);

    lines.push(
      <div
        key="user-to-start"
        style={{
          position: "absolute",
          left: from.x,
          top: from.y,
          width: length,
          height: 3,
          backgroundColor: "#0284c7", // darker blue for user-to-path
          transformOrigin: "0 0",
          transform: `rotate(${angle}deg)`,
          opacity: 0.9,
          borderRadius: 2,
          pointerEvents: "none",
          zIndex: 6,
        }}
      />
    );
  }

  // 2️⃣ Draw the route segments as usual
  for (let i = 0; i < route.length - 1; i++) {
    const from = getScreenPosition(route[i].coordinates);
    const to = getScreenPosition(route[i + 1].coordinates);

    const length = Math.hypot(to.x - from.x, to.y - from.y);
    const angle = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);

    lines.push(
      <div
        key={`${route[i].nodeId}-${route[i + 1].nodeId}`}
        style={{
          position: "absolute",
          left: from.x,
          top: from.y,
          width: length,
          height: 3,
          backgroundColor: "#0ea5e9",
          transformOrigin: "0 0",
          transform: `rotate(${angle}deg)`,
          opacity: 0.9,
          borderRadius: 2,
          pointerEvents: "none",
          zIndex: 5,
        }}
      />
    );
  }

  return <>{lines}</>;
};

export default RoutePolyline;
