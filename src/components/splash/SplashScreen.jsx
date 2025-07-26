
import { motion } from "framer-motion";

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#2255ff] to-[#1e40af] text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold tracking-widest">Gyan Path</h1>
        <p className="text-lg text-white/80">Your smart indoor navigator</p>
        <div className="mt-4 w-32 h-2 rounded-full bg-white/20 overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-white"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 1.4,
              ease: "linear",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
