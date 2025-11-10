import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
  image?: string;
}

interface InteractiveMapProps {
  imageUrl: string;
  hotspots: Hotspot[];
  alt: string;
}

export const InteractiveMap = ({ imageUrl, hotspots, alt }: InteractiveMapProps) => {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  return (
    <div className="relative w-full">
      <img src={imageUrl} alt={alt} className="w-full h-auto rounded-sm" />
      
      {hotspots.map((hotspot) => (
        <motion.button
          key={hotspot.id}
          className="absolute w-8 h-8 bg-primary rounded-full interactive-hotspot border-2 border-background flex items-center justify-center"
          style={{
            left: `${hotspot.x}%`,
            top: `${hotspot.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          onClick={() => setSelectedHotspot(hotspot)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-3 h-3 bg-background rounded-full" />
        </motion.button>
      ))}

      <AnimatePresence>
        {selectedHotspot && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedHotspot(null)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card p-8 rounded-sm shadow-2xl max-w-2xl w-full mx-4 z-50"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <button
                onClick={() => setSelectedHotspot(null)}
                className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="font-serif text-2xl text-primary mb-4">
                {selectedHotspot.title}
              </h3>
              
              {selectedHotspot.image && (
                <img
                  src={selectedHotspot.image}
                  alt={selectedHotspot.title}
                  className="w-full h-auto rounded-sm mb-4"
                />
              )}
              
              <p className="exhibit-body text-base leading-relaxed">
                {selectedHotspot.description}
              </p>
              
              <svg
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-full h-32 pointer-events-none"
                style={{ zIndex: -1 }}
              >
                <motion.path
                  d="M 50% 0 Q 50% 50, 50% 100"
                  className="connector-line"
                  fill="none"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
