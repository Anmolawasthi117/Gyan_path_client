import React, { useMemo, useRef, useState, useLayoutEffect } from "react";
import MarkerLayer from "./Marker";
import ConnectedEdges from "./ConnectedEdges";
import RoutePolyline from "./RoutePolyline";

import groundFloor from "../../assets/final maps/GGITS_Canteen.png";
import firstFloor from "../../assets/final maps/GGITS floor 2/1.png";
import secondFloor from "../../assets/final maps/GGITS floor 2/2.png";
import thirdFloor from "../../assets/final maps/GGITS floor 2/3.png";
import fourthFloor from "../../assets/final maps/GGITS floor 2/4.png";
import Civil from "../../assets/final maps/MBA 2/Civil Dept.png";
import IOT from "../../assets/final maps/MBA 2/IOT FLOOR.png";
import MBA from "../../assets/final maps/MBA 2/MBA ground Floor.png";
import Pharmaceutics from "../../assets/final maps/MBA 2/Pharmaceutics floor.png";

const floorImages = {
  "f1e15172-3c60-49e8-a03d-04435a6fdbe0": groundFloor,
  "b963f437-1372-44d7-8e93-32d119fa0b26": firstFloor,
  "d69a80f9-033b-4ba8-937f-d56a53d47631": secondFloor,
  "398027a5-dab8-4ca3-acb0-cc86e2bc3751": thirdFloor,
  "b314e388-6dfc-41c8-a740-9a263b8343ff": fourthFloor,
  "3986c025-3ca6-4a24-a6a9-f042cf222bdd": Civil,
  "b4319f20-f88f-43ee-acc1-fdf5e605264a": IOT,
  "e92ee147-5156-48d9-be08-bf2eddfd33cc": MBA,
  "a7fe434e-46d3-44c3-8c2e-95fa05411abf": Pharmaceutics,
};

const MAGIC_WIDTH = 960;
const MAGIC_HEIGHT = 653.6;

const Map = ({
  nodes = [],
  route = [],
  currentFloor,
  userLocation,
  onMarkerClick,
  selectedNodeId,
  highlightedNodeId,
  forceVisibleMarkers = false,
  extraNodes = [],
}) => {
  const outerRef = useRef(null);

  const [renderInfo, setRenderInfo] = useState({
    width: MAGIC_WIDTH,
    height: MAGIC_HEIGHT,
    offsetX: 0,
    offsetY: 0,
  });

  const allMarkers = useMemo(() => {
    const sameFloor = (n) =>
      String(n?.coordinates?.floor) === String(currentFloor?.id);
    return [...nodes.filter(sameFloor), ...extraNodes.filter(sameFloor)];
  }, [nodes, extraNodes, currentFloor]);

  // 🧠 Responsive scaling logic
  useLayoutEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    const handleResize = () => {
      const cw = el.clientWidth;
      const ch = el.clientHeight;

      const aspect = MAGIC_WIDTH / MAGIC_HEIGHT;
      let width = cw;
      let height = cw / aspect;

      if (height > ch) {
        height = ch;
        width = ch * aspect;
      }

      const offsetX = (cw - width) / 2;
      const offsetY = (ch - height) / 2;

      setRenderInfo({ width, height, offsetX, offsetY });
    };

    handleResize(); // initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const src = floorImages[currentFloor?.id] || groundFloor;

  const imageStyle = {
    width: renderInfo.width,
    height: renderInfo.height,
    left: renderInfo.offsetX,
    top: renderInfo.offsetY,
    position: "absolute",
    objectFit: "contain",
    pointerEvents: "none",
    userSelect: "none",
  };

  return (
    <div
      ref={outerRef}
      className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-200"
      style={{ overflow: "hidden", touchAction: "none" }}
    >
      {/* Floor Image */}
      <img
        src={src}
        alt={currentFloor?.name || "Floor"}
        style={imageStyle}
        draggable={false}
      />

      {/* Debug Border (remove in prod) */}
      {/* <div
        style={{
          position: "absolute",
          width: renderInfo.width,
          height: renderInfo.height,
          left: renderInfo.offsetX,
          top: renderInfo.offsetY,
          border: "2px dashed #aaa",
          pointerEvents: "none",
        }}
      /> */}

      {/* Node Layers */}
      {renderInfo.width > 0 && renderInfo.height > 0 && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "auto" }}>
          
            <ConnectedEdges nodes={allMarkers} renderInfo={renderInfo} />
         

          <MarkerLayer
            nodes={allMarkers}
            userLocation={userLocation}
            onMarkerClick={onMarkerClick}
            selectedNodeId={selectedNodeId}
            highlightedNodeId={highlightedNodeId}
            forceVisibleMarkers={forceVisibleMarkers}
            renderSize={renderInfo}
          />

          <RoutePolyline
            route={route}
            currentFloor={currentFloor?.id}
            renderSize={renderInfo}
          />
        </div>
      )}
    </div>
  );
};

export default Map;
