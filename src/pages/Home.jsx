// src/pages/Home.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Map from '../components/map/Map';
import SearchBar from '../components/search/SearchBar';
import BottomNavPanel from '../components/navigation/BottomNavPanel';
import FloorSelector from '../components/sidebar/FloorSelector';
import SplashScreen from '../components/splash/SplashScreen';

import nodesData from '../data/nodes_floorG.json';
import { distanceSq } from '../utils/math';
import { dijkstra } from '../utils/dijkstra';

const Home = () => {
  const [nodes, setNodes] = useState([]);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [route, setRoute] = useState([]);
  const [currentFloor, setCurrentFloor] = useState('G');
  const [userLoc, setUserLoc] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setNodes(nodesData);
    setTimeout(() => setShowSplash(false), 1500);
  }, []);

  const nearestNode = useCallback((pt) => {
    let best = null, bestD = Infinity;
    nodes.forEach(n => {
      const d = distanceSq(pt.x, pt.y, n.coordinates.x, n.coordinates.y);
      if (d < bestD) {
        best = n;
        bestD = d;
      }
    });
    return best;
  }, [nodes]);

  const handleMapClick = (pt) => {
    setUserLoc(pt);
    const nearest = nearestNode(pt);
    if (nearest) setStartNode(nearest);
  };

  const handleDestSelect = (node) => {
    setEndNode(node);
    if (!startNode?.nodeId) {
      console.warn('Set your location first (double-tap the map).');
      return;
    }
    const path = dijkstra(startNode.nodeId, node.nodeId, nodes);
    setRoute(path);
    setIsNavigating(true);
  };

  const allNodes = nodes;

  if (showSplash) return <SplashScreen />;

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
      <SearchBar nodes={allNodes} onSelectNode={handleDestSelect} />
      <Map
        userLocation={userLoc}
        onSelectLocation={handleMapClick}
        nodes={nodes}
        route={route}
        currentFloor={currentFloor}
      />
      <BottomNavPanel
        route={route}
        destination={endNode}
        isNavigating={isNavigating}
        loading={false}
      />
      <FloorSelector
        floors={['G', '1', 'MBA']}  // updated
        currentFloor={currentFloor}
        onChange={setCurrentFloor}
      />
    </div>
  );
};

export default Home;
