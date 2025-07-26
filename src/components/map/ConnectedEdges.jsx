// src/components/map/ConnectedEdges.jsx
import React from 'react';
import { Polyline } from 'react-leaflet';
import { gridToMapCoords } from '../../utils/transformCoords';

const ConnectedEdges = ({ nodes = [] }) => {
  const renderedPairs = new Set();

  return (
    <>
      {nodes.flatMap((node) =>
        node.connections
          .filter((conn) => conn.nodeId !== node.nodeId) // avoid self-loops
          .map((conn) => {
            const pairKey = [node.nodeId, conn.nodeId].sort().join('-');
            if (renderedPairs.has(pairKey)) return null;

            const target = nodes.find((n) => n.nodeId === conn.nodeId);
            if (!target) return null;

            renderedPairs.add(pairKey);

            const from = gridToMapCoords(node.coordinates);
            const to = gridToMapCoords(target.coordinates);

            return (
              <Polyline
                key={pairKey}
                positions={[
                  [from.lat, from.lng],
                  [to.lat, to.lng],
                ]}
                pathOptions={{
                  color: '#44ccff',
                  weight: 2,
                  opacity: 0.7,
                }}
              />
            );
          })
      )}
    </>
  );
};

export default ConnectedEdges;
