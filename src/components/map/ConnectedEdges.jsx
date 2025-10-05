import React from 'react';

const ConnectedEdges = ({ nodes = [], renderInfo }) => {
  const renderedPairs = new Set();

  const getScreenPosition = (coords) => {
    const x = renderInfo.offsetX + (coords.x / 100) * renderInfo.width;
    const y = renderInfo.offsetY + (coords.y / 100) * renderInfo.height;
    return { x, y };
  };

  const lines = [];

  nodes.forEach((node) => {
    node.connections?.forEach((conn) => {
      if (conn.nodeId === node.nodeId) return;

      const pairKey = [node.nodeId, conn.nodeId].sort().join('-');
      if (renderedPairs.has(pairKey)) return;
      renderedPairs.add(pairKey);

      const target = nodes.find((n) => n.nodeId === conn.nodeId);
      if (!target) return;

      const from = getScreenPosition(node.coordinates);
      const to = getScreenPosition(target.coordinates);

      const length = Math.hypot(to.x - from.x, to.y - from.y);
      const angle = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);

      lines.push(
        <div
          key={pairKey}
          style={{
            position: 'absolute',
            left: from.x,
            top: from.y,
            width: length,
            height: 2,
            backgroundColor: '#44ccff',
            transformOrigin: '0 0',
            transform: `rotate(${angle}deg)`,
            opacity: 0.7,
            pointerEvents: 'none',
          }}
        />
      );
    });
  });

  return <>{lines}</>;
};

export default ConnectedEdges;
