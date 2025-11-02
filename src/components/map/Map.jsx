import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  ImageOverlay,
  useMap,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import MarkerLayer from "./Marker";
import RoutePolyline from "./RoutePolyline";
import { floorDimensions } from "../../utils/mapConfig";
import { mapToGridCoords, clampGridPoint } from "../../utils/transformCoords";

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
  "8591c317-130d-49e0-a4b5-126a584b3bd7": groundFloor,
  "90c9b098-02c8-4dd0-8693-5ca0a855a431": firstFloor,
  "772283e6-2898-44e5-86ee-24fa7de7fed6": secondFloor,
  "a60297b0-40ab-4123-a7f4-e451c5a9b343": thirdFloor,
  "88a612bc-abd2-49ea-98bd-91c7f90067d4": fourthFloor,
  "76342efe-9f01-434b-b9b9-e4cba9446d75": Civil,
  "46fa26bb-3cda-47d6-a351-8f18f5316d7c": IOT,
  "cefd4e4e-3a9e-4659-829d-debfa385fd11": MBA,
  "8649e62e-f5a9-46f7-ac75-801dfa194ade": Pharmaceutics,
};

// Fit map to image bounds
const AutoFitImage = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || !bounds) return;
    map.fitBounds(bounds, { padding: [10, 10], animate: false });
  }, [map, bounds]);
  return null;
};

/**
 * Handles both double-click (desktop) and double-tap (mobile) for setting user location
 */
const MapClickHandler = ({ onSelectLocation, currentFloorId }) => {
  const lastTapRef = useRef({ time: 0, latlng: null });
  const DOUBLE_TAP_DELAY = 300; // ms

  useMapEvents({
    click: (e) => {
      const now = Date.now();
      const latlng = e.latlng;

      if (
        lastTapRef.current.latlng &&
        now - lastTapRef.current.time < DOUBLE_TAP_DELAY &&
        Math.abs(latlng.lat - lastTapRef.current.latlng.lat) < 0.0001 &&
        Math.abs(latlng.lng - lastTapRef.current.latlng.lng) < 0.0001
      ) {
        const gridPt = mapToGridCoords({
          lng: latlng.lng,
          lat: latlng.lat,
          floor: currentFloorId,
        });
        onSelectLocation?.(clampGridPoint(gridPt, currentFloorId));
        lastTapRef.current = { time: 0, latlng: null };
      } else {
        lastTapRef.current = { time: now, latlng };
      }
    },
    dblclick: (e) => {
      const gridPt = mapToGridCoords({
        lng: e.latlng.lng,
        lat: e.latlng.lat,
        floor: currentFloorId,
      });
      
      onSelectLocation?.(clampGridPoint(gridPt, currentFloorId));
    },
  });

  return null;
};

const Map = ({
  userLocation,
  nodes = [],
  route = [],
  currentFloor,
  onSelectLocation,
  onMarkerClick,
  selectedNodeId,
  highlightedNodeId,
  forceVisibleMarkers = false,
}) => {
  const containerRef = useRef(null);
  const [renderSize, setRenderSize] = useState({
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
  });

  const image = floorImages[currentFloor?.id] || groundFloor;
  const { width, height } =
    floorDimensions[currentFloor?.id] || { width: 2000, height: 3000 };
  const bounds = useMemo(
    () => [
      [0, 0],
      [height, width],
    ],
    [width, height]
  );

  // Measure container for RoutePolyline
  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setRenderSize({
      width: rect.width,
      height: rect.height,
      offsetX: 0,
      offsetY: 0,
    });
  }, [currentFloor, route]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full bg-gray-100">
      <MapContainer
        crs={L.CRS.Simple}
        bounds={bounds}
        center={[height / 2, width / 2]}
        zoom={-1}
        minZoom={-4}
        maxZoom={5}
        zoomControl={false}
        doubleClickZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <ImageOverlay url={image} bounds={bounds} />
        <AutoFitImage bounds={bounds} />
        <ZoomControl position="bottomright" />

        <MapClickHandler
          onSelectLocation={onSelectLocation}
          currentFloorId={currentFloor?.id}
        />

        <MarkerLayer
          nodes={nodes}
          userLocation={userLocation}
          currentFloorId={currentFloor?.id}
          onMarkerClick={onMarkerClick}
          selectedNodeId={selectedNodeId}
          highlightedNodeId={highlightedNodeId}
          forceVisibleMarkers={forceVisibleMarkers}
        />

        {renderSize.width > 0 && renderSize.height > 0 && (
          <RoutePolyline
            route={route}
            currentFloor={currentFloor?.id}
            userLocation={userLocation}
            renderSize={renderSize}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
