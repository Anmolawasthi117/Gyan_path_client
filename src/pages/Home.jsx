// src/pages/Home.jsx
import React, { useState, useEffect, useCallback } from "react";
import Map from "../components/map/Map";
import SearchBar from "../components/search/SearchBar";
import BottomNavPanel from "../components/navigation/BottomNavPanel";
import FloorSelector from "../components/sidebar/FloorSelector";
import SplashScreen from "../components/splash/SplashScreen";
import Footer from "../components/common/Footer";

import projectSchema from "../data/project-schema-final.json";

import { distanceSq } from "../utils/math";
import { splitPathByFloor } from "../utils/splitPathByFloor";
import { findMultiFloorPath } from "../utils/multiFloorRoute"; // 🆕 new helper

const Home = () => {
  const [nodes, setNodes] = useState([]);
  const [floors, setFloors] = useState([]);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [route, setRoute] = useState([]);
  const [currentFloor, setCurrentFloor] = useState(null);
  const [userLoc, setUserLoc] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const { floors } = projectSchema;
    setFloors(floors);

    const mergedNodes = floors.flatMap((f) =>
      f.nodes.map((n) => ({ ...n, floorId: f.id }))
    );
    setNodes(mergedNodes);

    if (floors.length > 0) setCurrentFloor(floors[0]);

    setTimeout(() => setShowSplash(false), 1500);
  }, []);

  const nearestNode = useCallback((pt, floorId) => {
  let best = null, bestD = Infinity;
  nodes.forEach((n) => {
    if (String(n.coordinates.floor) !== String(floorId)) return; // ✅ critical
    const d = distanceSq(pt.x, pt.y, n.coordinates.x, n.coordinates.y);
    if (d < bestD) { best = n; bestD = d; }
  });
  return best;
}, [nodes]);


  const handleMapClick = (pt) => {
    const nearest = nearestNode(pt,currentFloor?.id);
    if (nearest) {
      console.log("🟢 [User Click] Nearest node:", nearest.name, nearest);
      setUserLoc(pt);
      setStartNode(nearest);
    }
  };

  const handleDestSelect = (node) => {
  setEndNode(node);
  if (!startNode?.nodeId) {
    console.warn("⚠️ Set your location first (double-tap the map).");
    return;
  }

  console.log(
    "🚀 Running multi-floor Dijkstra from",
    startNode.name,
    "→",
    node.name
  );

  const path = findMultiFloorPath(projectSchema, startNode.nodeId, node.nodeId);
  console.log("✅ [Full Route Result]", path.map((n) => n.name));

  setRoute(path);
  setIsNavigating(true);
};

  if (showSplash) return <SplashScreen />;

  const segments = splitPathByFloor(route);
  console.log("🧩 [Split Route Segments]", segments);

  const currentSegment =
    segments.find((seg) => seg.floor === currentFloor?.id)?.nodes || [];

  console.log(
    "🗺️ [Render Floor]",
    currentFloor?.name,
    "with segment:",
    currentSegment.map((n) => n.name)
  );

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
      <SearchBar nodes={nodes} onSelectNode={handleDestSelect} />

      <Map
        userLocation={userLoc}
        onSelectLocation={handleMapClick}
        nodes={nodes}
        route={currentSegment}
        currentFloor={currentFloor}
      />

      <BottomNavPanel
        route={route}
        destination={endNode}
        isNavigating={isNavigating}
        loading={false}
        currentFloor={currentFloor?.id}
        onFloorChange={(nextFloorId) => {
          console.log("🔁 [Floor Change Requested]", nextFloorId);
          const floorObj = floors.find((f) => f.id === nextFloorId);
          setCurrentFloor(floorObj);

          const seg = segments.find((s) => s.floor === nextFloorId);
          if (seg && seg.nodes.length > 0) {
            const stairNode = seg.nodes[0];
            console.log("🚶 [Switched Floor Start Node]", stairNode.name);
            setStartNode(stairNode);
            setUserLoc(stairNode.coordinates);
          }
        }}
      />

      <FloorSelector
        floors={floors}
        currentFloor={currentFloor}
        onChange={setCurrentFloor}
      />
      <Footer />
    </div>
  );
};

export default Home;
