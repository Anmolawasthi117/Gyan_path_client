import { motion, AnimatePresence } from 'framer-motion';

const BottomNavPanel = ({ route = [], isNavigating = false, destination = null, loading = false }) => {
  const startNode = route?.[0];
  const endNode = destination;

  const distance = route.length ? `${route.length - 1} m` : '—';
  const userLocationText = startNode ? `📍 ${startNode.name}` : '📍 Location not set';
  const directionText =
    isNavigating && endNode
      ? `➡️ Go to ${endNode.name} • ${loading ? 'calculating…' : distance}`
      : '';

  const isVisible = !!startNode || isNavigating;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-4 left-4 right-4 z-20 bg-gradient-to-br from-[#2255ff] to-[#1e40af] text-white px-4 py-3 rounded-2xl shadow-xl flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <span className="font-medium">{userLocationText}</span>
          {isNavigating && (
            <span className="text-sm">{directionText}</span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BottomNavPanel;
