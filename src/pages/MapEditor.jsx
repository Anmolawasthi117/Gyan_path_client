// src/pages/MapEditor.jsx
import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import Map from '../components/map/Map';

const MapEditor = ({ currentFloor = 'G', onFloorChange = () => {} }) => {
  const [draftNodes, setDraftNodes] = useState([]);
  const [connectMode, setConnectMode] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const handleClick = ({ x, y }) => {
    if (connectMode) return;

    const name = prompt('Node name?');
    if (!name) return;
    const type = prompt('Type (room/hallway/stair/elevator)?', 'room');
    if (!type) return;

    const node = {
      nodeId: crypto.randomUUID(),
      name,
      type,
      coordinates: { x, y, floor: currentFloor },
      connections: [],
    };

    setDraftNodes((prev) => [...prev, node]);
  };

  const handleNodeClick = (clickedId) => {
    if (!connectMode) return;

    if (!selectedNodeId) {
      setSelectedNodeId(clickedId);
    } else if (clickedId === selectedNodeId) {
      setSelectedNodeId(null);
    } else {
      const from = draftNodes.find((n) => n.nodeId === selectedNodeId);
      const to = draftNodes.find((n) => n.nodeId === clickedId);
      if (!from || !to) return;

      const dx = from.coordinates.x - to.coordinates.x;
      const dy = from.coordinates.y - to.coordinates.y;
      const distance = parseFloat(Math.sqrt(dx * dx + dy * dy).toFixed(2));

      const connect = (a, b) => {
        if (!a.connections.some((c) => c.nodeId === b.nodeId)) {
          a.connections.push({ nodeId: b.nodeId, distance });
        }
      };

      connect(from, to);
      connect(to, from);

      setDraftNodes([...draftNodes]);
      setSelectedNodeId(null);
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(draftNodes, null, 2)], {
      type: 'application/json',
    });
    saveAs(blob, `nodes_floor${currentFloor}.json`);
  };

  return (
    <div className="relative h-screen w-screen">
      <Map
        mode="admin"
        onSelectLocation={handleClick}
        extraNodes={draftNodes}
        onMarkerClick={(node) => handleNodeClick(node.nodeId)}
        selectedNodeId={selectedNodeId}
        currentFloor={currentFloor}
        forceVisibleMarkers={true} 
      />

      <div className="absolute bottom-4 right-4 flex gap-4">
        <button
          onClick={exportJson}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          Export JSON
        </button>
        <button
          onClick={() => {
            setDraftNodes([]);
            setSelectedNodeId(null);
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
        >
          Clear All
        </button>
        <button
          onClick={() => {
            setConnectMode(!connectMode);
            setSelectedNodeId(null);
          }}
          className={`${
            connectMode ? 'bg-yellow-500' : 'bg-gray-700'
          } hover:opacity-90 text-white px-4 py-2 rounded shadow`}
        >
          {connectMode ? 'Cancel Connect Mode' : 'Connect Nodes'}
        </button>
      </div>
    </div>
  );
};

export default MapEditor;
