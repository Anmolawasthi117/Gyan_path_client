// src/pages/Home.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Map from '../components/map/Map';
import SearchBar from '../components/search/SearchBar';
import BottomNavPanel from '../components/navigation/BottomNavPanel';
import FloorSelector from '../components/sidebar/FloorSelector';
import SplashScreen from '../components/splash/SplashScreen';
import Footer from '../components/common/Footer';

import nodesFloorG from '../data/nodes_floorG.json';
import nodesFloor1 from '../data/nodes_floor1.json';

import { distanceSq } from '../utils/math';
import { dijkstra } from '../utils/dijkstra';
import { linkStairs } from '../utils/linkStairs';
import { splitPathByFloor } from '../utils/splitPathByFloor'; // 🟢 added

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
    // 🟢 Merge nodes from both floors and link stairs
    const merged = [...nodesFloorG, ...nodesFloor1];
    const linked = linkStairs(merged);

    console.log("🟡 Loaded nodes:", linked.length);
    setNodes(linked);

    setTimeout(() => setShowSplash(false), 1500);
  }, []);

  // find nearest node to a point
  const nearestNode = useCallback(
    (pt) => {
      let best = null, bestD = Infinity;
      nodes.forEach((n) => {
        const d = distanceSq(pt.x, pt.y, n.coordinates.x, n.coordinates.y);
        if (d < bestD) {
          best = n;
          bestD = d;
        }
      });
      return best;
    },
    [nodes]
  );

  const handleMapClick = (pt) => {
    setUserLoc(pt);
    const nearest = nearestNode(pt);
    if (nearest) {
      console.log("🟢 Start node set:", nearest.name, nearest.coordinates.floor);
      setStartNode(nearest);
    }
  };

  const handleDestSelect = (node) => {
    setEndNode(node);
    if (!startNode?.nodeId) {
      console.warn('⚠️ Set your location first (double-tap the map).');
      return;
    }

    const path = dijkstra(startNode.nodeId, node.nodeId, nodes);

    console.log(
      "🟢 Dijkstra path:",
      path.map((p) => `${p.name} (${p.coordinates.floor})`)
    );

    setRoute(path);
    setIsNavigating(true);
  };

  if (showSplash) return <SplashScreen />;

  // 🟢 split route by floors
  const segments = splitPathByFloor(route);
  const currentSegment =
    segments.find((seg) => seg.floor === currentFloor)?.nodes || [];

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
      <SearchBar nodes={nodes} onSelectNode={handleDestSelect} />

      <Map
  userLocation={userLoc}
  onSelectLocation={handleMapClick}
  nodes={nodes}
  // 🟢 only send current floor’s path
  route={currentSegment}
  currentFloor={currentFloor}
/>


      <BottomNavPanel
  route={route}
  destination={endNode}
  isNavigating={isNavigating}
  loading={false}
  currentFloor={currentFloor}
  onFloorChange={(nextFloor) => {
    setCurrentFloor(nextFloor);

    // 🟢 Find matching stair node on that floor
    const segments = splitPathByFloor(route);
    const seg = segments.find((s) => s.floor === nextFloor);
    if (seg && seg.nodes.length > 0) {
      const stairNode = seg.nodes[0]; // first node of that floor’s segment
      setStartNode(stairNode);
      setUserLoc(stairNode.coordinates); // update blue dot also
      console.log("🟢 Shifted user location to", stairNode.name, nextFloor);
    }
  }}
/>

      <FloorSelector
        floors={['G', '1']} // 🟢 simplified for now
        currentFloor={currentFloor}
        onChange={setCurrentFloor}
      />
      <Footer />
    </div>
    
  );
};

export default Home;
