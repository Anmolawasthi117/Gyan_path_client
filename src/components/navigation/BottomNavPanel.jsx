import { motion, AnimatePresence } from "framer-motion";
import { splitPathByFloor } from "../../utils/splitPathByFloor";

const BottomNavPanel = ({
  route = [],
  isNavigating = false,
  destination = null,
  loading = false,
  currentFloor,
  onFloorChange, // ✅ required
}) => {
  const startNode = route?.[0];
  const endNode = destination;

  const distance = route.length ? `${route.length - 1} m` : "—";
  const userLocationText = startNode
    ? `📍 ${startNode.name} (${startNode.coordinates?.floor})`
    : "📍 Location not set";

  const directionText =
    isNavigating && endNode
      ? `➡️ Go to ${endNode.name} (${endNode.coordinates?.floor}) • ${
          loading ? "calculating…" : distance
        }`
      : "";

  const isVisible = !!startNode || isNavigating;

  // ✅ split path into floor segments
  const segments = splitPathByFloor(route);

  // find current floor segment
  const currentSegmentIndex = segments.findIndex(
    (seg) => String(seg.floor) === String(currentFloor)
  );
  const currentSegment = segments[currentSegmentIndex];
  const nextSegment = segments[currentSegmentIndex + 1];
  const prevSegment = segments[currentSegmentIndex - 1]; // 🟢 NEW

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-4 left-4 right-4 z-20 bg-gradient-to-br from-[#2255ff] to-[#1e40af] text-white px-4 py-3 rounded-2xl shadow-xl flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <span className="font-medium">{userLocationText}</span>
          {isNavigating && currentSegment && (
            <span className="text-sm">
              ➡️ On Floor {currentSegment.floor} ({currentSegment.nodes.length - 1} steps)
            </span>
          )}

          {/* ✅ Up button */}
          {isNavigating && nextSegment && (
            <button
              onClick={() => onFloorChange(nextSegment.floor)}
              className="ml-2 px-3 py-1 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
            >
              ⬆ Go to Floor {nextSegment.floor}
            </button>
          )}

          {/* ✅ Down button */}
          {isNavigating && prevSegment && (
            <button
              onClick={() => onFloorChange(prevSegment.floor)}
              className="ml-2 px-3 py-1 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
            >
              ⬇ Go to Floor {prevSegment.floor}
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BottomNavPanel;
