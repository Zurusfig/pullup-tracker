import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RepCounter({ count }) {
  const [flash, setFlash] = useState(false);
  const [floats, setFloats] = useState([]);
  const [prevCount, setPrevCount] = useState(count);

  useEffect(() => {
    if (count > prevCount) {
      setFlash(true);
      const id = Date.now();
      setFloats((prev) => [...prev, id]);
      const flashTimer = setTimeout(() => setFlash(false), 300);
      const floatTimer = setTimeout(() => setFloats((prev) => prev.filter((f) => f !== id)), 900);
      setPrevCount(count);
      return () => {
        clearTimeout(flashTimer);
        clearTimeout(floatTimer);
      };
    }
    setPrevCount(count);
  }, [count, prevCount]);

  return (
    <div className="relative flex flex-col items-center justify-center py-6">
      <motion.div
        animate={{ scale: flash ? 1.12 : 1, color: flash ? '#58CC02' : '#111827' }}
        transition={{ duration: 0.2 }}
        className="font-extrabold leading-none text-[clamp(96px,25vw,160px)] dark:text-white"
      >
        {count}
      </motion.div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">reps</p>

      <div className="absolute top-0 right-1/4 pointer-events-none">
        <AnimatePresence>
          {floats.map((id) => (
            <motion.div
              key={id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -60 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute text-brand-purple font-extrabold text-xl"
            >
              +1 XP
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
